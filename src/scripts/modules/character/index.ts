import { characterCTLimit } from 'data/game-config';

import Weapons from 'modules/weapon';
import Skillsets from 'modules/skillset';
import Attributes from 'modules/attributes';
import MagicSkills from 'modules/skill/magic';
import WeaponSkills from 'modules/skill/weapon';
import CharacterActions from 'modules/character-action';

import { Direction } from 'modules/direction';
import { PlayerType } from 'modules/player/types';
import { IPosition } from 'modules/position/types';
import { ICharacter } from 'modules/character/types';
import { SkillType } from 'modules/skill/attributes';
import { ICharacterData } from 'modules/character-data/types';
import { IActionItem, ActionID, IActions } from 'modules/character-action/types';

const attackAction = CharacterActions.get(ActionID.ATTACK);
const doubleAttackAction = CharacterActions.get(ActionID.DOUBLE_ATTACK);
const weaponAction = CharacterActions.get(ActionID.WEAPON);
const magicAction = CharacterActions.get(ActionID.MAGIC);
const confirmAction = CharacterActions.get(ActionID.CONFIRM);
const passAction = CharacterActions.get(ActionID.PASS);
const backAction = CharacterActions.get(ActionID.BACK);

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

		actions.push(attackAction(
			`Attack (${wpn.title})`,
			skill.cost,
			AP >= skill.cost,
			[id]
		));
	}

	// DOUBLE ATTACK action
	if (attackActionSkills.length > 1) {
		const costs = attackActionSkills.map(([id, wpn]) => WeaponSkills.get(id).cost);
		const cost = costs.reduce((a, b) => a + b);

		actions.push(doubleAttackAction(
			undefined,
			cost,
			AP >= cost,
			attackActionSkills.map(([id, wpn]) => id)
		));
	}

	// WEAPON actions
	for (const [id, wpn] of WeaponSkills.filterSpecial(main, off)) {
		const skill = WeaponSkills.get(id);

		actions.push(weaponAction(
			`${skill.title} (${wpn.title})`,
			skill.cost,
			AP >= skill.cost,
			[id]
		));
	}

	// MAGIC actions
	for (const id of skillset.skills) {
		const skill = MagicSkills.get(id);

		if (SkillType.ACTIVE === skill.type) {
			actions.push(magicAction(
				`${skill.title} (${skillset.title})`,
				skill.cost,
				AP >= skill.cost,
				[id]
			));
		}
	}

	// PASS action
	actions.push(passAction());

	return actions;
};

const getSkillActions = (skillName: string, cost: number, targets?: IPosition[]): IActionItem[] => {
	const actions: IActionItem[] = [];

	// confirm skill action
	if (targets) {
		actions.push(confirmAction(skillName, cost));
	}

	// cancel skill action
	actions.push(backAction());

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

const Character = {
	create,
	isEqual,
	tick,
	getActions,
	getSkillActions,
	startTurn
};

export default Character;
