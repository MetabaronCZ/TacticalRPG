import Skill from 'engine/skill';
import Character from 'engine/character';
import SkillUtils from 'engine/skill/utils';
import { WeaponSkillID } from 'engine/skill/weapon';
import CharacterAction from 'engine/character-action';

class CharacterActions {
	public static readonly dontReactAction = new CharacterAction('DONT_REACT', 'Pass');
	public static readonly directAction = new CharacterAction('DIRECT', 'Direct');
	public static readonly backAction = new CharacterAction('BACK', 'Back');
	public static readonly passAction = new CharacterAction('PASS', 'End turn');

	public static getConfirmAction(title = 'Confirm', cost = 0): CharacterAction {
		return new CharacterAction('CONFIRM', title, cost, true, []);
	}

	public static getIdleActions(character: Character): CharacterAction[] {
		const skillset = character.skillset;
		const AP = character.attributes.get('AP');

		const mainHand = character.mainHand;
		const offHand = character.offHand;
		const actions: CharacterAction[] = [];
		const attackSkillList: Skill[] = [];

		// ATTACK actions
		for (const wpn of [mainHand, offHand]) {
			const attackSkills = SkillUtils.filterAttack(wpn.skills);

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
			for (const skill of SkillUtils.filterSpecial(wpn.skills)) {
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
		actions.push(CharacterActions.passAction);

		return actions;
	}

	public static getSkillActions(): CharacterAction[] {
		return [CharacterActions.backAction];
	}

	public static getSkillConfirmActions(action: CharacterAction, targets: Character[] = []): CharacterAction[] {
		const actions: CharacterAction[] = [];

		// confirm skill action
		if (targets.length) {
			const confirmAction = CharacterActions.getConfirmAction(action.getTitle(), action.getCost());
			actions.push(confirmAction);
		}

		// cancel skill action
		actions.push(CharacterActions.backAction);

		return actions;
	}

	public static getReactiveActions(character: Character): CharacterAction[] {
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
		actions.push(CharacterActions.dontReactAction);

		return actions;
	}

	public static getEvasiveActions(): CharacterAction[] {
		return [CharacterActions.backAction];
	}

	public static getDirectActions(): CharacterAction[] {
		return [CharacterActions.directAction];
	}
}

export default CharacterActions;
