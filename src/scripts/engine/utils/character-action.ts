import Skill from 'engine/skill';
import Character from 'engine/character';
import { WeaponSkillID } from 'engine/skill/weapon';
import CharacterAction from 'engine/character-action';
import { filterAttackSkills, filterSpecialSkills } from 'engine/utils/skill';

export const getDontReactAction = () => new CharacterAction('DONT_REACT', 'Pass');
export const getDirectAction = () => new CharacterAction('DIRECT', 'Direct');
export const getBackAction = () => new CharacterAction('BACK', 'Back');
export const getPassAction = () => new CharacterAction('PASS', 'End turn');

export const getConfirmAction = (title = 'Confirm', cost = 0): CharacterAction => {
	return new CharacterAction('CONFIRM', title, cost, true, []);
};

export const getIdleActions = (character: Character): CharacterAction[] => {
	const skillset = character.skillset;
	const AP = character.attributes.get('AP');

	const mainHand = character.mainHand;
	const offHand = character.offHand;
	const actions: CharacterAction[] = [];
	const attackSkillList: Skill[] = [];

	// ATTACK actions
	for (const wpn of [mainHand, offHand]) {
		const attackSkills = filterAttackSkills(wpn.skills);

		for (const skill of attackSkills) {
			const cost = skill.cost;
			const action = new CharacterAction('ATTACK', `Attack (${wpn.title})`, cost, AP >= cost, [skill]);
			attackSkillList.push(skill);
			actions.push(action);
		}
	}

	// DOUBLE ATTACK action
	if (attackSkillList.length > 1) {
		const cost = attackSkillList.map(skill => skill.cost).reduce((a, b) => a + b);
		const action = new CharacterAction('DOUBLE_ATTACK', 'Double Attack', cost, AP >= cost, attackSkillList);
		actions.push(action);
	}

	// WEAPON actions
	for (const wpn of [mainHand, offHand]) {
		for (const skill of filterSpecialSkills(wpn.skills)) {
			const { title, cost } = skill;
			const action = new CharacterAction('WEAPON', `${title} (${wpn.title})`, cost, AP >= cost, [skill]);
			actions.push(action);
		}
	}

	// MAGIC actions
	for (const skill of skillset.skills) {
		const { title, type, cost } = skill;

		if ('ACTIVE' !== type) {
			continue;
		}
		const action = new CharacterAction('MAGIC', `${title} (${skillset.title})`, cost, AP >= cost, [skill]);
		actions.push(action);
	}

	// PASS action
	actions.push(getPassAction());

	return actions;
};

export const getSkillActions = (): CharacterAction[] => {
	return [getBackAction()];
};

export const getSkillConfirmActions = (action: CharacterAction, targets: Character[] = []): CharacterAction[] => {
	const actions: CharacterAction[] = [];

	// confirm skill action
	if (targets.length) {
		const confirmAction = getConfirmAction(action.getTitle(), action.getCost());
		actions.push(confirmAction);
	}

	// cancel skill action
	actions.push(getBackAction());

	return actions;
};

export const getReactiveActions = (character: Character): CharacterAction[] => {
	const AP = character.attributes.get('AP');
	const offHand = character.offHand;
	const actions: CharacterAction[] = [];

	// EVADE action
	if (character.isSpeedType()) {
		const skill = new Skill('EVADE');
		const { title, cost } = skill;

		if (AP >= cost) {
			const action = new CharacterAction('REACTION', title, cost, true, [skill]);
			actions.push(action);
		}
	}

	// BLOCK action
	if ('SHIELD' === offHand.type) {
		let id: WeaponSkillID;

		if ('SHIELD_LARGE' === offHand.id) {
			id = 'SHIELD_LARGE_BLOCK';
		} else {
			id = 'SHIELD_SMALL_BLOCK';
		}
		const skill = new Skill(id);
		const { title, cost } = skill;

		if (AP >= cost) {
			const action = new CharacterAction('REACTION', title, cost, true, [skill]);
			actions.push(action);
		}
	}

	// PASS action
	actions.push(getDontReactAction());

	return actions;
};

export const getEvasiveActions = (): CharacterAction[] => {
	return [getBackAction()];
};

export const getDirectActions = (): CharacterAction[] => {
	return [getDirectAction()];
};
