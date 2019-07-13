import Skill from 'modules/skill';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import { SkillID } from 'modules/skill/skill-data';
import { WeaponSkillID } from 'modules/skill/weapon';
import { getDynamicSkillID } from 'modules/skill/dynamic';

export const getDontReactCommand = (): Command => new Command('DONT_REACT', 'Don\'t react');
export const getConfirmCommand = (): Command => new Command('CONFIRM', 'Confirm command');
export const getCancelCommand = (): Command => new Command('BACK', 'Cancel command');
export const getPassCommand = (): Command => new Command('PASS', 'End turn');
export const getDirectCommand = (): Command => new Command('DIRECT', 'Direct');
export const getContinueCommand = (): Command => new Command('DONT_REACT', 'Continue');

export const getIdleCommands = (character: Character): Command[] => {
	const { mainHand, offHand, skillset } = character;
	const commands: Command[] = [];
	const attackSkillList: Skill[] = [];
	const skillIds: SkillID[] = [];

	// ATTACK command
	for (const wpn of [mainHand, offHand]) {
		const attackSkills = Skill.filterAttack(wpn.skills);

		for (const skill of attackSkills) {
			attackSkillList.push(skill);

			if (!skillIds.find(id => id === skill.id)) {
				skillIds.push(skill.id);

				const cmd = new Command('ATTACK', `Attack (${wpn.title})`, character, [skill]);
				commands.push(cmd);
			}
		}
	}

	// DOUBLE ATTACK command
	if (attackSkillList.length > 1) {
		const doubleAttack = new Skill('DOUBLE_ATTACK');

		// add DOUBLE_ATTACK to skills (for computations only)
		const skills = [...attackSkillList, doubleAttack];

		const cmd = new Command('DOUBLE_ATTACK', doubleAttack.title, character, skills);
		commands.push(cmd);
	}

	// WEAPON commands
	for (const wpn of [mainHand, offHand]) {
		for (const skill of Skill.filterSpecial(wpn.skills)) {
			if (skillIds.find(id => id === skill.id)) {
				continue;
			}
			skillIds.push(skill.id);

			const cmd = new Command('WEAPON', `${skill.title} (${wpn.title})`, character, [skill]);
			commands.push(cmd);
		}
	}

	// DYNAMIC commands
	if ('NONE' !== skillset.element) {
		for (const wpn of [mainHand, offHand]) {
			const skillID = getDynamicSkillID(wpn, skillset);

			if (skillID) {
				if (skillIds.find(id => id === skillID)) {
					continue;
				}
				const skill = new Skill(skillID);
				skillIds.push(skill.id);

				const cmd = new Command('DYNAMIC', skill.title, character, [skill]);
				commands.push(cmd);
			}
		}
	}

	// MAGIC commands
	for (const skill of skillset.skills) {
		const { title, type } = skill;

		if ('ACTIVE' === type) {
			const cmdTitle = `${title} (${skillset.title} ${skill.getGradeTitle()})`;

			const cmd = new Command('MAGIC', cmdTitle, character, [skill]);
			commands.push(cmd);
		}
	}

	// PASS command
	commands.push(getPassCommand());

	return commands;
};

export const getSkillConfirmCommands = (hasTargets: boolean): Command[] => {
	const commands: Command[] = [];

	// confirm skill command
	if (hasTargets) {
		commands.push(getConfirmCommand());
	}

	// cancel skill command
	commands.push(getCancelCommand());

	return commands;
};

export const getReactiveCommands = (character: Character, isBackAttack: boolean, canEvade: boolean, isSupport: boolean): Command[] => {
	if (isSupport) {
		return [getContinueCommand()];
	}
	const { offHand, armor } = character;
	const { MP } = character.attributes;
	const canMove = character.canMove();
	const commands: Command[] = [];

	// EVADE command
	if ('LIGHT' === armor.id) {
		const skill = new Skill('EVADE');
		const cmd = new Command('REACTION', skill.title, character, [skill]);

		if (cmd.isActive() && (isBackAttack || !canMove || !canEvade)) {
			cmd.setActive('CANT_ACT');
		}
		commands.push(cmd);
	}

	// BLOCK command
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

		const cmd = new Command('REACTION', title, character, [skill]);

		if (cmd.isActive() && isBackAttack) {
			cmd.setActive('CANT_ACT');
		}
		commands.push(cmd);
	}

	// ENERGY SHIELD command
	if ('MAGICAL' === armor.id) {
		const skill = new Skill('ENERGY_SHIELD');
		const title = `${skill.title} ${MP}`;

		const cmd = new Command('REACTION', title, character, [skill]);

		if (isBackAttack) {
			cmd.setActive('CANT_ACT');
		}
		if (cmd.isActive() && 0 === MP) {
			cmd.setActive('OUT_OF_MP');
		}
		commands.push(cmd);
	}

	// PASS command
	commands.push(getDontReactCommand());

	return commands;
};

export const getEvasiveCommands = (): Command[] => [getCancelCommand()];
export const getDirectCommands = (): Command[] => [getDirectCommand()];
