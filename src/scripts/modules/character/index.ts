import { characterCTLimit } from 'data/game-config';

import Weapons from 'modules/weapon';
import Skillsets from 'modules/skillset';
import Attributes from 'modules/attributes';
import MagicSkills from 'modules/skill/magic';
import WeaponSkills from 'modules/skill/weapon';
import StatusEffects from 'modules/status-effect';
import CharacterData from 'modules/character-data';
import ArchetypeSkills from 'modules/skill/archetype';
import CharacterAction from 'modules/character-action';

import { Direction } from 'modules/direction';
import { PlayerType } from 'modules/player/types';
import { IPosition } from 'modules/position/types';
import { SkillType } from 'modules/skill/attributes';
import { ICharacter } from 'modules/character/types';
import { WeaponSkillID } from 'modules/skill/weapon/types';
import { StatusEffectID } from 'modules/status-effect/types';
import { ICharacterData } from 'modules/character-data/types';
import { WeaponID, WeaponTypeID } from 'modules/weapon/types';
import { ArchetypeSkillID } from 'modules/skill/archetype/types';
import { IActionItem, ActionID, IActions } from 'modules/character-action/types';

const dontReactAction = CharacterAction.dontReactAction;
const confirmAction = CharacterAction.confirmAction;
const backAction = CharacterAction.backAction;
const passAction = CharacterAction.passAction;

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
		currAttributes,
		status: []
	};
};

const isEqual = (charA: ICharacter, charB: ICharacter): boolean => {
	return charA.data.id === charB.data.id;
};

const tick = (char: ICharacter): ICharacter => {
	if (isDead(char)) {
		return char;
	}
	return {
		...char,
		currAttributes: {
			...char.currAttributes,
			CT: (char.currAttributes.CT + char.currAttributes.SPD)
		}
	};
};

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
			title: `Attack (${wpn.title})`,
			cost: skill.cost,
			active: (AP >= skill.cost),
			skills: [id]
		});
	}

	// DOUBLE ATTACK action
	if (attackActionSkills.length > 1) {
		const costs = attackActionSkills.map(([id, wpn]) => WeaponSkills.get(id).cost);
		const cost = costs.reduce((a, b) => a + b);

		actions.push({
			id: ActionID.DOUBLE_ATTACK,
			title: 'Double Attack',
			cost,
			active: (AP >= cost),
			skills: attackActionSkills.map(([id, wpn]) => id)
		});
	}

	// WEAPON actions
	for (const [id, wpn] of WeaponSkills.filterSpecial(main, off)) {
		const skill = WeaponSkills.get(id);

		actions.push({
			id: ActionID.WEAPON,
			title: `${skill.title} (${wpn.title})`,
			cost: skill.cost,
			active: (AP >= skill.cost),
			skills: [id]
		});
	}

	// MAGIC actions
	for (const id of skillset.skills) {
		const skill = MagicSkills.get(id);

		if (SkillType.ACTIVE === skill.type) {
			actions.push({
				id: ActionID.MAGIC,
				title: `${skill.title} (${skillset.title})`,
				cost: skill.cost,
				active: (AP >= skill.cost),
				skills: [id]
			});
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

const getReactiveActions = (char: ICharacter): IActions => {
	const actions: IActions = [];
	const offHand = Weapons.get(char.data.off);
	const charAP = char.currAttributes.AP;

	// EVADE action
	if (CharacterData.isSpeedType(char.data)) {
		const id = ArchetypeSkillID.EVADE;
		const skill = ArchetypeSkills.get(id);

		if (charAP >= skill.cost) {
			actions.push({
				id: ActionID.REACTION,
				title: skill.title,
				cost: skill.cost,
				active: true,
				skills: [id]
			});
		}
	}

	// BLOCK action
	if (WeaponTypeID.SHIELD === offHand.type) {
		let id: WeaponSkillID;

		if (WeaponID.SHIELD_LARGE === char.data.off) {
			id = WeaponSkillID.SHIELD_LARGE_BLOCK;
		} else {
			id = WeaponSkillID.SHIELD_SMALL_BLOCK;
		}
		const skill = WeaponSkills.get(id);

		if (charAP >= skill.cost) {
			actions.push({
				id: ActionID.REACTION,
				title: skill.title,
				cost: skill.cost,
				active: true,
				skills: [id]
			});
		}
	}

	// PASS action
	actions.push(dontReactAction());

	return actions;
};

const getEvasionActions = (): IActions => ([
	backAction()
]);

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

const reduceAP = (char: ICharacter, cost: number): ICharacter => {
	return {
		...char,
		currAttributes: {
			...char.currAttributes,
			AP: char.currAttributes.AP - cost
		}
	};
};

const applySkill = (char: ICharacter, damage: number, effectIds: StatusEffectID[]): ICharacter => {
	const effects = effectIds.map(id => StatusEffects.get(id)());
	const damaged = char.currAttributes.HP - damage;

	return {
		...char,
		currAttributes: {
			...char.currAttributes,
			HP: (damaged > 0 ? damaged : 0)
		},
		status: [...char.status, ...effects]
	};
};

const applyStatus = (char: ICharacter, effectId: StatusEffectID): ICharacter => {
	const effect = StatusEffects.get(effectId);

	return {
		...char,
		status: [...char.status, effect()]
	};
};

const removeStatus = (char: ICharacter, effectId: StatusEffectID): ICharacter => ({
	...char,
	status: char.status.filter(status => effectId !== status.id)
});

const isDead = (char: ICharacter): boolean => char.currAttributes.HP <= 0;

const Character = {
	create,
	isEqual,
	tick,
	getActions,
	getSkillActions,
	getReactiveActions,
	getEvasionActions,
	startTurn,
	reduceAP,
	applySkill,
	applyStatus,
	removeStatus,
	isDead
};

export default Character;
