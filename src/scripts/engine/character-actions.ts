import Character from 'engine/character';
import Skillsets from 'engine/skillset';
import MagicSkills from 'engine/skill/magic';
import WeaponSkills from 'engine/skill/weapon';
import CharacterAction from 'engine/character-action';
import { WeaponSkillID } from 'engine/skill/weapon/types';
import ArchetypeSkills, { ArchetypeSkillID } from 'engine/skill/archetype';

import Weapons from 'modules/weapon';
import { WeaponTypeID, WeaponID } from 'modules/weapon/types';

class CharacterActions {
	public static readonly dontReactAction = new CharacterAction('DONT_REACT', 'Pass', 0, true, []);
	public static readonly directAction = new CharacterAction('DIRECT', 'Direct', 0, true, []);
	public static readonly backAction = new CharacterAction('BACK', 'Back', 0, true, []);
	public static readonly passAction = new CharacterAction('PASS', 'End turn', 0, true, []);

	public static getConfirmAction(title = 'Confirm', cost = 0): CharacterAction {
		return new CharacterAction('CONFIRM', title, cost, true, []);
	}

	public static getIdleActions(character: Character): CharacterAction[] {
		const { main, off, skillset } = character.getData();
		const AP = character.getAttribute('AP');

		const mainHand = Weapons.get(main);
		const offHand = Weapons.get(off);
		const charSkillset = Skillsets.get(skillset);
		const attackActionSkills = WeaponSkills.filterAttack(mainHand, offHand);
		const actions: CharacterAction[] = [];

		// ATTACK actions
		for (const [id, wpn] of attackActionSkills) {
			const { cost } = WeaponSkills.get(id);
			const action = new CharacterAction('ATTACK', `Attack (${wpn.title})`, cost, AP >= cost, [id]);
			actions.push(action);
		}

		// DOUBLE ATTACK action
		if (attackActionSkills.length > 1) {
			const costs = attackActionSkills.map(([id, wpn]) => WeaponSkills.get(id).cost);
			const cost = costs.reduce((a, b) => a + b);
			const skills = attackActionSkills.map(([id, wpn]) => id);
			const action = new CharacterAction('DOUBLE_ATTACK', 'Double Attack', cost, AP >= cost, skills);
			actions.push(action);
		}

		// WEAPON actions
		for (const [id, wpn] of WeaponSkills.filterSpecial(mainHand, offHand)) {
			const { cost, title } = WeaponSkills.get(id);
			const action = new CharacterAction('WEAPON', `${title} (${wpn.title})`, cost, AP >= cost, [id]);
			actions.push(action);
		}

		// MAGIC actions
		for (const id of charSkillset.skills) {
			const { type, title, cost } = MagicSkills.get(id);

			if ('ACTIVE' !== type) {
				continue;
			}
			const action = new CharacterAction('MAGIC', `${title} (${charSkillset.title})`, cost, AP >= cost, [id]);
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
		const { off } = character.getData();
		const AP = character.getAttribute('AP');
		const offHand = Weapons.get(off);
		const actions: CharacterAction[] = [];

		// EVADE action
		if (character.isSpeedType()) {
			const id: ArchetypeSkillID = 'EVADE';
			const { cost, title } = ArchetypeSkills.get(id);

			if (AP >= cost) {
				const action = new CharacterAction('REACTION', title, cost, true, [id]);
				actions.push(action);
			}
		}

		// BLOCK action
		if (WeaponTypeID.SHIELD === offHand.type) {
			let id: WeaponSkillID;

			if (WeaponID.SHIELD_LARGE === off) {
				id = 'SHIELD_LARGE_BLOCK';
			} else {
				id = 'SHIELD_SMALL_BLOCK';
			}
			const { title, cost } = WeaponSkills.get(id);

			if (AP >= cost) {
				const action = new CharacterAction('REACTION', title, cost, true, [id]);
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
