import Skill from 'modules/skill';
import Character from 'modules/character';
import { SkillID } from 'modules/skill/skill-data';
import { WeaponSkillID } from 'modules/skill/weapon';
import { getDynamicSkillID } from 'modules/skill/dynamic';
import CharacterAction, { ICharacterActionCost } from 'modules/battle/character-action';

export const getDontReactAction = (): CharacterAction => new CharacterAction('DONT_REACT', 'Pass');
export const getDirectAction = (): CharacterAction => new CharacterAction('DIRECT', 'Direct');
export const getBackAction = (): CharacterAction => new CharacterAction('BACK', 'Back');
export const getPassAction = (): CharacterAction => new CharacterAction('PASS', 'End turn');

export const getConfirmAction = (title = 'Confirm', cost: ICharacterActionCost | null): CharacterAction => {
	const action = new CharacterAction('CONFIRM', title);
	action.cost = cost;
	return action;
};

export const getIdleActions = (character: Character): CharacterAction[] => {
	const { mainHand, offHand, skillset } = character;
	const actions: CharacterAction[] = [];
	const attackSkillList: Skill[] = [];
	const skillIds: SkillID[] = [];

	// ATTACK actions
	for (const wpn of [mainHand, offHand]) {
		const attackSkills = Skill.filterAttack(wpn.skills);

		for (const skill of attackSkills) {
			attackSkillList.push(skill);

			if (!skillIds.find(id => id === skill.id)) {
				skillIds.push(skill.id);

				const action = new CharacterAction('ATTACK', `Attack (${wpn.title})`, character, [skill]);
				actions.push(action);
			}
		}
	}

	// DOUBLE ATTACK action
	if (attackSkillList.length > 1) {
		const doubleAttack = new Skill('DOUBLE_ATTACK');
		const skills = [...attackSkillList, doubleAttack];

		const action = new CharacterAction('DOUBLE_ATTACK', doubleAttack.title, character, skills);
		actions.push(action);
	}

	// WEAPON actions
	for (const wpn of [mainHand, offHand]) {
		for (const skill of Skill.filterSpecial(wpn.skills)) {
			if (skillIds.find(id => id === skill.id)) {
				continue;
			}
			skillIds.push(skill.id);

			const action = new CharacterAction('WEAPON', `${skill.title} (${wpn.title})`, character, [skill]);
			actions.push(action);
		}
	}

	// DYNAMIC actions
	if ('NONE' !== skillset.element) {
		for (const wpn of [mainHand, offHand]) {
			const skillID = getDynamicSkillID(wpn, skillset);

			if (null !== skillID) {
				if (skillIds.find(id => id === skillID)) {
					continue;
				}
				const skill = new Skill(skillID);
				skillIds.push(skill.id);

				const action = new CharacterAction('DYNAMIC', skill.title, character, [skill]);
				actions.push(action);
			}
		}
	}

	// MAGIC actions
	for (const skill of skillset.skills) {
		const { title, type } = skill;

		if ('ACTIVE' === type) {
			const actionTitle = `${title} (${skillset.title} ${skill.getGradeTitle()})`;

			const action = new CharacterAction('MAGIC', actionTitle, character, [skill]);
			actions.push(action);
		}
	}

	// PASS action
	actions.push(getPassAction());

	return actions;
};

export const getSkillConfirmActions = (action: CharacterAction, hasTargets: boolean): CharacterAction[] => {
	const actions: CharacterAction[] = [];

	// confirm skill action
	if (hasTargets) {
		const confirmAction = getConfirmAction(action.title, action.cost);
		actions.push(confirmAction);
	}

	// cancel skill action
	actions.push(getBackAction());

	return actions;
};

export const getReactiveActions = (character: Character, isBackAttack: boolean, canEvade: boolean): CharacterAction[] => {
	const { offHand, armor } = character;
	const { MP } = character.attributes;
	const canMove = character.canMove();
	const actions: CharacterAction[] = [];

	// EVADE action
	if ('LIGHT' === armor.id) {
		const skill = new Skill('EVADE');
		const action = new CharacterAction('REACTION', skill.title, character, [skill]);

		if (isBackAttack || !canMove || !canEvade) {
			action.active = false;
		}
		actions.push(action);
	}

	// BLOCK action
	if ('SHIELD' === offHand.type) {
		let id: WeaponSkillID;

		if ('SHIELD_LARGE' === offHand.id) {
			id = 'SHD_LARGE_BLOCK';
		} else {
			id = 'SHD_SMALL_BLOCK';
		}
		const skill = new Skill(id);
		const block = (offHand.block || 0) * skill.block;
		const title = `${skill.title} ${block}`;

		const action = new CharacterAction('REACTION', title, character, [skill]);

		if (isBackAttack) {
			action.active = false;
		}
		actions.push(action);
	}

	// ENERGY SHIELD action
	if (character.archetype.type.M) {
		const skill = new Skill('ENERGY_SHIELD');
		const title = `${skill.title} ${MP}`;

		const action = new CharacterAction('REACTION', title, character, [skill]);

		if (isBackAttack || 0 === MP) {
			action.active = false;
		}
		actions.push(action);
	}

	// PASS action
	actions.push(getDontReactAction());

	return actions;
};

export const getEvasiveActions = (): CharacterAction[] => [getBackAction()];
export const getDirectActions = (): CharacterAction[] => [getDirectAction()];
