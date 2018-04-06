import { Weapons } from 'models/weapon';
import { PlayerType } from 'models/player';
import { IPath } from 'models/pathfinding';
import { IPosition } from 'models/position';
import { ICharacterData } from 'models/character-data';
import { IAttributes, Attributes } from 'models/attributes';

import { WeaponSKillID } from 'models/skill/weapon/id';
import { WeaponSKills } from 'models/skill/weapon';
import { JobSKillID } from 'models/skill/job/id';
import { JobSKills } from 'models/skill/job';
import { Skillsets } from 'models/skillset';
import { SKillType, Skill } from 'models/skill';

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
	readonly title: string;
	readonly active: boolean;
	readonly skills?: WeaponSKillID[] | JobSKillID[];
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
	title: 'End turn',
	active: true
};

const confirmMoveAction = (length: number): IActionItem => ({
	id: ActionID.CONFIRM,
	title: `Move (${length} AP)`,
	active: true
});

const backAction: IActionItem = {
	id: ActionID.BACK,
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
		const attackActionSkills = WeaponSKills.filterAttack(main, off);
		const attributes = actor.currAttributes;
		const actions: IActionItem[] = [];
		const AP = attributes.AP;

		// MOVE action
		actions.push({
			id: ActionID.MOVE,
			title: `Move`,
			active: !hasMoved && AP > 0
		});

		// ATTACK actions
		for (const [id, wpn] of attackActionSkills) {
			const skill = WeaponSKills.get(id);
			const active = (AP >= skill.cost);

			actions.push({
				id: ActionID.ATTACK,
				title: `Attack (${wpn.title})${active ? ' [' + skill.cost + ' AP]' : ''}`,
				skills: [id],
				active
			});
		}

		// DOUBLE ATTACK action
		if (attackActionSkills.length > 1) {
			const costs = attackActionSkills.map(([id, wpn]) => WeaponSKills.get(id).cost);
			const cost = costs.reduce((a, b) => a + b);
			const active = (AP >= cost);

			actions.push({
				id: ActionID.DOUBLE_ATTACK,
				title: `Double Attack${active ? ' [' + cost + ' AP]' : ''}`,
				skills: attackActionSkills.map(([id, wpn]) => id),
				active
			});
		}

		// WEAPON actions
		for (const [id, wpn] of WeaponSKills.filterSpecial(main, off)) {
			const skill = WeaponSKills.get(id);
			const active = (AP >= skill.cost);

			actions.push({
				id: ActionID.WEAPON,
				title: `${skill.title} (${wpn.title})${active ? ' [' + skill.cost + ' AP]' : ''}`,
				skills: [id],
				active
			});
		}

		// JOB actions
		for (const id of skillset.skills) {
			const skill = JobSKills.get(id);
			const active = (AP >= skill.cost);

			if (SKillType.ACTIVE === skill.type) {
				actions.push({
					id: ActionID.JOB,
					title: `${skill.title} (${actor.data.job})${active ? ' [' + skill.cost + ' AP]' : ''}`,
					skills: [id],
					active
				});
			}
		}

		// PASS action
		actions.push(passAction);

		return actions;
	}

	public static getMoveActions(path?: IPath): IActionItem[] {
		const actions: IActionItem[] = [];

		// confirm MOVE action
		if (path) {
			actions.push(confirmMoveAction(path.length));
		}

		// cancel MOVE action
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
