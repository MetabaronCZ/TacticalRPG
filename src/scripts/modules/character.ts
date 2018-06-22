import { characterCTLimit } from 'data/game-config';

import { Weapons } from 'modules/weapon';
import { PlayerType } from 'modules/player';
import { Skillsets } from 'modules/skillset';
import { IPosition } from 'modules/position';
import { Direction } from 'modules/direction';
import { MagicSkills } from 'modules/skill/magic';
import { WeaponSkills } from 'modules/skill/weapon';
import { SkillType } from 'modules/skill/attributes';
import { ICharacterData } from 'modules/character-data';
import { IAttributes, Attributes } from 'modules/attributes';
import { IActionItem, ActionID, IActions, passAction, confirmAction, backAction } from 'modules/character-action';

export interface ICharacter {
	readonly data: ICharacterData;
	readonly player: PlayerType;
	readonly baseAttributes: IAttributes;
	currAttributes: IAttributes;
	position: IPosition;
	direction: Direction;
}

const create = (data: ICharacterData, position: IPosition, direction: Direction, player: PlayerType): ICharacter => {
	const baseAttributes = Attributes.create(data.archetype);
	const currAttributes = Attributes.create(data.archetype);

	// set small random initial CP
	currAttributes.CT = Math.floor((characterCTLimit / 10) * Math.random());

	return {
		data,
		player,
		position,
		direction,
		baseAttributes,
		currAttributes
	};
};

const isEqual = (charA: ICharacter, charB: ICharacter): boolean => {
	return charA.data.id === charB.data.id;
};

const tick = (char: ICharacter): ICharacter => ({
	...char,
	currAttributes: {
		...char.currAttributes,
		CT: (char.currAttributes.CT + char.currAttributes.SPD)
	}
});

const getActions = (actor: ICharacter): IActions => {
	const main = Weapons.get(actor.data.main);
	const off = Weapons.get(actor.data.off);
	const skillset = Skillsets.get(actor.data.skillset);
	const attackActionSkills = WeaponSkills.filterAttack(main, off);
	const AP = actor.currAttributes.AP;
	const actions: IActionItem[] = [];

	// ATTACK actions
	for (const [id, wpn] of attackActionSkills) {
		const skill = WeaponSkills.get(id);

		actions.push({
			id: ActionID.ATTACK,
			cost: skill.cost,
			title: `Attack (${wpn.title})`,
			skills: [id],
			active: (AP >= skill.cost)
		});
	}

	// DOUBLE ATTACK action
	if (attackActionSkills.length > 1) {
		const costs = attackActionSkills.map(([id, wpn]) => WeaponSkills.get(id).cost);
		const cost = costs.reduce((a, b) => a + b);

		actions.push({
			id: ActionID.DOUBLE_ATTACK,
			cost,
			title: 'Double Attack',
			skills: attackActionSkills.map(([id, wpn]) => id),
			active: (AP >= cost)
		});
	}

	// WEAPON actions
	for (const [id, wpn] of WeaponSkills.filterSpecial(main, off)) {
		const skill = WeaponSkills.get(id);

		actions.push({
			id: ActionID.WEAPON,
			cost: skill.cost,
			title: `${skill.title} (${wpn.title})`,
			skills: [id],
			active: (AP >= skill.cost)
		});
	}

	// MAGIC actions
	for (const id of skillset.skills) {
		const skill = MagicSkills.get(id);

		if (SkillType.ACTIVE === skill.type) {
			actions.push({
				id: ActionID.MAGIC,
				cost: skill.cost,
				title: `${skill.title} (${skillset.title})`,
				skills: [id],
				active: (AP >= skill.cost)
			});
		}
	}

	// PASS action
	actions.push(passAction);

	return actions;
};

const getSkillActions = (skillName: string, cost: number, targets?: IPosition[]): IActionItem[] => {
	const actions: IActionItem[] = [];

	// confirm skill action
	if (targets) {
		actions.push(confirmAction(skillName, cost));
	}

	// cancel skill action
	actions.push(backAction);

	return actions;
};

const startTurn = (actor: ICharacter): ICharacter => {
	// regenerate AP
	const newAP = actor.baseAttributes.AP;

	return {
		...actor,
		currAttributes: {
			...actor.currAttributes,
			AP: newAP
		}
	};
};

export const Character = {
	create,
	isEqual,
	tick,
	getActions,
	getSkillActions,
	startTurn
};
