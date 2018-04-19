import { Weapons } from 'models/weapon';
import { PlayerType } from 'models/player';
import { IPosition } from 'models/position';
import { ICharacterData } from 'models/character-data';
import { IAttributes, Attributes } from 'models/attributes';

import { WeaponSkillID } from 'models/skill/weapon/id';
import { WeaponSkills } from 'models/skill/weapon';
import { JobSkillID } from 'models/skill/job/id';
import { JobSkills } from 'models/skill/job';
import { Skillsets } from 'models/skillset';
import { SkillType, Skill, ISkill } from 'models/skill';

export enum ActionID {
	MOVE = 'MOVE',
	ATTACK = 'ATTACK',
	DOUBLE_ATTACK = 'DOUBLE_ATTACK',
	WEAPON = 'WEAPON',
	JOB = 'JOB',
	PASS = 'PASS',
	CONFIRM = 'CONFIRM',
	BACK = 'BACK'
}

export interface IActionItem {
	readonly id: ActionID;
	readonly cost: number;
	readonly title: string;
	readonly active: boolean;
	readonly skills?: WeaponSkillID[] | JobSkillID[];
}

export type IActions = IActionItem[];

export interface ICharacter {
	readonly data: ICharacterData;
	readonly player: PlayerType;
	readonly position: IPosition;
	readonly baseAttributes: IAttributes;
	readonly currAttributes: IAttributes;
}

const passAction: IActionItem = {
	id: ActionID.PASS,
	cost: 0,
	title: 'End turn',
	active: true
};

const confirmAction = (skillName: string, cost: number): IActionItem => ({
	id: ActionID.CONFIRM,
	cost,
	title: skillName,
	active: true
});

const backAction: IActionItem = {
	id: ActionID.BACK,
	cost: 0,
	title: 'Back',
	active: true
};

export class Character {
	// maximum point of CP of every character
	public static cpLimit = 100;

	public static create(data: ICharacterData, position: IPosition, player: PlayerType): ICharacter {
		const baseAttrs = Attributes.create(data.primary, data.secondary);
		const currAttrs = Attributes.create(data.primary, data.secondary);

		// set small random initial CP
		currAttrs.CP = Math.floor((Character.cpLimit / 10) * Math.random());

		return {
			data,
			player,
			position,
			baseAttributes: baseAttrs,
			currAttributes: currAttrs
		};
	}

	public static tick(char: ICharacter): ICharacter {
		const updated = JSON.parse(JSON.stringify(char)) as ICharacter;
		updated.currAttributes.CP += updated.currAttributes.SPD;
		return updated;
	}

	public static getActions(actor: ICharacter, hasMoved: boolean): IActions {
		const main = Weapons.get(actor.data.main);
		const off = Weapons.get(actor.data.off);
		const skillset = Skillsets.get(actor.data.skillset);
		const attackActionSkills = WeaponSkills.filterAttack(main, off);
		const attributes = actor.currAttributes;
		const actions: IActionItem[] = [];
		const AP = attributes.AP;

		// MOVE action
		actions.push({
			id: ActionID.MOVE,
			cost: 0,
			title: 'Move',
			active: !hasMoved && AP > 0
		});

		// ATTACK actions
		for (const [id, wpn] of attackActionSkills) {
			const skill = WeaponSkills.get(id);
			const active = (AP >= skill.cost);

			actions.push({
				id: ActionID.ATTACK,
				cost: skill.cost,
				title: `Attack (${wpn.title})`,
				skills: [id],
				active
			});
		}

		// DOUBLE ATTACK action
		if (attackActionSkills.length > 1) {
			const costs = attackActionSkills.map(([id, wpn]) => WeaponSkills.get(id).cost);
			const cost = costs.reduce((a, b) => a + b);
			const active = (AP >= cost);

			actions.push({
				id: ActionID.DOUBLE_ATTACK,
				cost,
				title: 'Double Attack',
				skills: attackActionSkills.map(([id, wpn]) => id),
				active
			});
		}

		// WEAPON actions
		for (const [id, wpn] of WeaponSkills.filterSpecial(main, off)) {
			const skill = WeaponSkills.get(id);
			const active = (AP >= skill.cost);

			actions.push({
				id: ActionID.WEAPON,
				cost: skill.cost,
				title: `${skill.title} (${wpn.title})`,
				skills: [id],
				active
			});
		}

		// JOB actions
		for (const id of skillset.skills) {
			const skill = JobSkills.get(id);
			const active = (AP >= skill.cost);

			if (SkillType.ACTIVE === skill.type) {
				actions.push({
					id: ActionID.JOB,
					cost: skill.cost,
					title: `${skill.title} (${actor.data.job})`,
					skills: [id],
					active
				});
			}
		}

		// PASS action
		actions.push(passAction);

		return actions;
	}

	public static getMoveActions(path?: IPosition[]): IActionItem[] {
		const actions: IActionItem[] = [];

		// confirm MOVE action
		if (path) {
			actions.push(confirmAction('Move', path.length));
		}

		// cancel MOVE action
		actions.push(backAction);

		return actions;
	}

	public static getSkillActions(skillName: string, cost: number, targets?: IPosition[]): IActionItem[] {
		const actions: IActionItem[] = [];

		// confirm skill action
		if (targets) {
			actions.push(confirmAction(skillName, cost));
		}

		// cancel skill action
		actions.push(backAction);

		return actions;
	}

	public static startTurn(actor: ICharacter): ICharacter {
		// regenerate AP
		const newAP = actor.baseAttributes.AP;

		return {
			...actor,
			currAttributes: {
				...actor.currAttributes,
				AP: newAP
			}
		};
	}
}
