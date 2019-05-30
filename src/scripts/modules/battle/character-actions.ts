import Skill from 'modules/skill';
import Character from 'modules/character';
import Status from 'modules/character/status';
import { SkillID } from 'modules/skill/skill-data';
import { WeaponSkillID } from 'modules/skill/weapon';
import { getDynamicSkillID } from 'modules/skill/dynamic';
import CharacterAction, { ICharacterActionCost } from 'modules/battle/character-action';

const getCost = (skill: Skill, status: Status): ICharacterActionCost => {
	const costModifier = (status.has('CONFUSION') ? 2 : 1);
	return {
		AP: skill.apCost * costModifier,
		MP: skill.mpCost * costModifier
	};
};

export const canUseSkill = (cost: ICharacterActionCost | null, AP: number, MP: number): boolean => {
	if (null === cost) {
		return true;
	}
	return AP >= cost.AP && MP >= cost.MP;
};

export const getDontReactAction = (): CharacterAction => new CharacterAction('DONT_REACT', 'Pass');
export const getDirectAction = (): CharacterAction => new CharacterAction('DIRECT', 'Direct');
export const getBackAction = (): CharacterAction => new CharacterAction('BACK', 'Back');
export const getPassAction = (): CharacterAction => new CharacterAction('PASS', 'End turn');

export const getConfirmAction = (title = 'Confirm', cost: ICharacterActionCost | null): CharacterAction => {
	return new CharacterAction('CONFIRM', title, cost);
};

export const getIdleActions = (character: Character): CharacterAction[] => {
	const { mainHand, offHand, skillset, status } = character;
	const { AP, MP } = character.attributes;
	const actions: CharacterAction[] = [];
	const attackSkillList: Skill[] = [];
	const skillIds: SkillID[] = [];

	const canAct = character.canAct();
	const isDisarmed = status.has('DISARM');
	const isSilenced = status.has('SILENCE');

	// ATTACK actions
	for (const wpn of [mainHand, offHand]) {
		const attackSkills = Skill.filterAttack(wpn.skills);

		for (const skill of attackSkills) {
			attackSkillList.push(skill);

			if (!skillIds.find(id => id === skill.id)) {
				skillIds.push(skill.id);

				const cost = getCost(skill, status);
				const cd = character.cooldowns[skill.id] || 0;
				const isActive = (canUseSkill(cost, AP, MP) && 0 === cd && canAct && !isDisarmed);

				const action = new CharacterAction('ATTACK', `Attack (${wpn.title})`, cost, cd, isActive, [skill]);
				actions.push(action);
			}
		}
	}

	// DOUBLE ATTACK action
	if (attackSkillList.length > 1) {
		const doubleAttack = new Skill('DOUBLE_ATTACK');
		const skills = [...attackSkillList, doubleAttack];
		const cds = skills.map(skill => character.cooldowns[skill.id] || 0);

		let cd = 0;

		for (const c of cds) {
			if ('ULTIMATE' !== c && c > cd) {
				cd = c;
			}
		}

		const cost = skills
			.map(skill => getCost(skill, status))
			.reduce((a, b) => ({
				AP: a.AP + b.AP,
				MP: a.MP + b.MP
			}));

		const isActive = (canUseSkill(cost, AP, MP) && 0 === cd && canAct && !isDisarmed);

		const action = new CharacterAction('DOUBLE_ATTACK', doubleAttack.title, cost, cd, isActive, skills);
		actions.push(action);
	}

	// WEAPON actions
	for (const wpn of [mainHand, offHand]) {
		for (const skill of Skill.filterSpecial(wpn.skills)) {
			if (skillIds.find(id => id === skill.id)) {
				continue;
			}
			skillIds.push(skill.id);

			const cost = getCost(skill, status);
			const cd = character.cooldowns[skill.id] || 0;
			const isActive = (canUseSkill(cost, AP, MP) && 0 === cd && canAct && !isDisarmed);

			const action = new CharacterAction('WEAPON', `${skill.title} (${wpn.title})`, cost, cd, isActive, [skill]);
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

				const cost = getCost(skill, status);
				const cd = character.cooldowns[skill.id] || 0;
				const isActive = (canUseSkill(cost, AP, MP) && 0 === cd && canAct && !isDisarmed);

				const action = new CharacterAction('DYNAMIC', skill.title, cost, cd, isActive, [skill]);
				actions.push(action);
			}
		}
	}

	// MAGIC actions
	for (const skill of skillset.skills) {
		const { title, type } = skill;
		const cost = getCost(skill, status);
		const cd = character.cooldowns[skill.id] || 0;

		if ('ACTIVE' === type) {
			const isActive = (canUseSkill(cost, AP, MP) && 0 === cd && canAct && !isSilenced);
			const actionTitle = `${title} (${skillset.title} ${skill.getGradeTitle()})`;

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

export const getReactiveActions = (character: Character, isBackAttack: boolean, canEvade: boolean): CharacterAction[] => {
	const { offHand, armor, status } = character;
	const { AP, MP } = character.attributes;
	const isDisarmed = status.has('DISARM');
	const canAct = character.canAct();
	const canMove = character.canMove();
	const actions: CharacterAction[] = [];

	// EVADE action
	if ('LIGHT' === armor.id) {
		const skill = new Skill('EVADE');
		const cost = getCost(skill, status);
		const isActive = (canUseSkill(cost, AP, MP) && !isBackAttack && canMove && canEvade);

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
		const cost = getCost(skill, status);
		const isActive = (canUseSkill(cost, AP, MP) && !isBackAttack && canAct && !isDisarmed);
		const block = (offHand.block || 0) * skill.block;
		const title = `${skill.title} ${block}`;

		const action = new CharacterAction('REACTION', title, cost, 0, isActive, [skill]);
		actions.push(action);
	}

	// ENERGY SHIELD action
	if (character.archetype.type.M) {
		const skill = new Skill('ENERGY_SHIELD');
		const cost = getCost(skill, status);
		const isActive = (canUseSkill(cost, AP, MP) && !isBackAttack && canAct && MP > 0);
		const title = `${skill.title} ${MP}`;

		const action = new CharacterAction('REACTION', title, cost, 0, isActive, [skill]);
		actions.push(action);
	}

	// PASS action
	actions.push(getDontReactAction());

	return actions;
};

export const getSkillActions = (): CharacterAction[] => [getBackAction()];
export const getEvasiveActions = (): CharacterAction[] => [getBackAction()];
export const getDirectActions = (): CharacterAction[] => [getDirectAction()];
