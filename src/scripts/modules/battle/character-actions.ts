import Skill from 'modules/skill';
import Character from 'modules/character';
import { WeaponSkillID } from 'modules/skill/weapon';
import CharacterAction from 'modules/battle/character-action';

export const getDontReactAction = (): CharacterAction => new CharacterAction('DONT_REACT', 'Pass');
export const getDirectAction = (): CharacterAction => new CharacterAction('DIRECT', 'Direct');
export const getBackAction = (): CharacterAction => new CharacterAction('BACK', 'Back');
export const getPassAction = (): CharacterAction => new CharacterAction('PASS', 'End turn');

export const getConfirmAction = (title = 'Confirm', cost = 0): CharacterAction => {
	return new CharacterAction('CONFIRM', title, cost);
};

export const getIdleActions = (character: Character): CharacterAction[] => {
	const { mainHand, offHand, skillset, status } = character;
	const AP = character.attributes.AP;
	const canAct = character.canAct();
	const actions: CharacterAction[] = [];
	const attackSkillList: Skill[] = [];

	const isDisarmed = status.has('DISARM');
	const isSilenced = status.has('SILENCE');

	const getCost = (skill: Skill) => skill.cost * (status.has('CONFUSION') ? 2 : 1);

	// ATTACK actions
	for (const wpn of [mainHand, offHand]) {
		const attackSkills = Skill.filterAttack(wpn.skills);

		for (const skill of attackSkills) {
			const cd = character.cooldowns[skill.id] || 0;

			if ('ULTIMATE' !== cd) {
				const cost = getCost(skill);
				const isActive = (AP >= cost && 0 === cd && canAct && !isDisarmed);
				const action = new CharacterAction('ATTACK', `Attack (${wpn.title})`, cost, cd, isActive, [skill]);
				attackSkillList.push(skill);
				actions.push(action);
			}
		}
	}

	// DOUBLE ATTACK action
	if (attackSkillList.length > 1) {
		const cds = attackSkillList.map(skill => character.cooldowns[skill.id] || 0);

		if (-1 === cds.indexOf('ULTIMATE')) {
			let cd = 0;

			for (const c of cds) {
				if ('ULTIMATE' !== c && c > cd) {
					cd = c;
				}
			}
			const cost = attackSkillList
				.map(skill => getCost(skill))
				.reduce((a, b) => a + b);

			const isActive = (AP >= cost && 0 === cd && canAct && !isDisarmed);

			const action = new CharacterAction('DOUBLE_ATTACK', 'Double Attack', cost, cd, isActive, attackSkillList);
			actions.push(action);
		}
	}

	// WEAPON actions
	for (const wpn of [mainHand, offHand]) {
		for (const skill of Skill.filterSpecial(wpn.skills)) {
			const cd = character.cooldowns[skill.id] || 0;

			if ('ULTIMATE' !== cd) {
				const cost = getCost(skill);
				const isActive = (AP >= cost && 0 === cd && canAct && !isDisarmed);

				const action = new CharacterAction('WEAPON', `${skill.title} (${wpn.title})`, cost, cd, isActive, [skill]);
				actions.push(action);
			}
		}
	}

	// MAGIC actions
	for (const skill of skillset.skills) {
		const { title, type } = skill;
		const cost = getCost(skill);
		const cd = character.cooldowns[skill.id] || 0;

		if ('ULTIMATE' !== cd && 'ACTIVE' === type) {
			const isActive = (AP >= cost && 0 === cd && canAct && !isSilenced);
			const actionTitle = `${title} (${skillset.title} lv. ${skillset.grade})`;
			const action = new CharacterAction('MAGIC', actionTitle, cost, cd, isActive, [skill]);
			actions.push(action);
		}
	}

	// PASS action
	actions.push(getPassAction());

	return actions;
};

export const getSkillConfirmActions = (action: CharacterAction, targets: Character[] = []): CharacterAction[] => {
	const actions: CharacterAction[] = [];

	// confirm skill action
	if (targets.length) {
		const confirmAction = getConfirmAction(action.title, action.cost);
		actions.push(confirmAction);
	}

	// cancel skill action
	actions.push(getBackAction());

	return actions;
};

export const getReactiveActions = (character: Character, isBackAttack: boolean): CharacterAction[] => {
	const { offHand, armor, status } = character;
	const isDisarmed = status.has('DISARM');
	const AP = character.attributes.AP;
	const canAct = character.canAct();
	const canMove = character.canMove();
	const actions: CharacterAction[] = [];

	const getCost = (skill: Skill) => {
		return skill.cost * (status.has('CONFUSION') ? 2 : 1);
	};

	// EVADE action
	if ('LIGHT' === armor.id) {
		const skill = new Skill('EVADE');
		const cost = getCost(skill);
		const isActive = (AP >= cost && !isBackAttack && canMove);

		const action = new CharacterAction('REACTION', skill.title, cost, 0, isActive, [skill]);
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
		const cost = getCost(skill);
		const isActive = (AP >= cost && !isBackAttack && canAct && !isDisarmed);

		const action = new CharacterAction('REACTION', skill.title, cost, 0, isActive, [skill]);
		actions.push(action);
	}

	// PASS action
	actions.push(getDontReactAction());

	return actions;
};

export const getSkillActions = (): CharacterAction[] => [getBackAction()];
export const getEvasiveActions = (): CharacterAction[] => [getBackAction()];
export const getDirectActions = (): CharacterAction[] => [getDirectAction()];
