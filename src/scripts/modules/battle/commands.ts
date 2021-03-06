import Skill from 'modules/skill';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import { SkillID } from 'modules/skill/skill-data';
import { WeaponSkillID } from 'modules/skill/weapon';
import { getDynamicSkillID } from 'modules/skill/dynamic';

const getDontReactCommand = (): Command => new Command('DONT_REACT', 'Don\'t react');
const getConfirmCommand = (): Command => new Command('CONFIRM', 'Confirm command');
const getCancelCommand = (): Command => new Command('BACK', 'Cancel command');
const getPassCommand = (): Command => new Command('PASS', 'End turn');
export const getContinueCommand = (): Command => new Command('DONT_REACT', 'Continue');

export const getIdleCommands = (character: Character): Command[] => {
	const { mainHand, offHand, skillset } = character;
	const attackSkillList: Skill[] = [];
	const skillIds: SkillID[] = [];
	const commands: Command[] = [];

	// ATTACK command
	for (const wpn of [mainHand, offHand]) {
		const attackSkills = Skill.filterAttack(wpn.skills);

		for (const skill of attackSkills) {
			attackSkillList.push(skill);

			if (!skillIds.find(id => id === skill.id)) {
				skillIds.push(skill.id);

				const cmd = new Command('ATTACK', skill.title, character, [skill]);
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

			const cmd = new Command('WEAPON', skill.title, character, [skill]);
			commands.push(cmd);
		}
	}

	// DYNAMIC commands
	if (skillset.element) {
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
		if ('ACTIVE' === skill.type) {
			const cmd = new Command('MAGIC', skill.title, character, [skill]);
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
	const isSilenced = character.status.has('SILENCE');

	const commands: Command[] = [];

	// BLOCK command
	if ('SHIELD' === offHand.type) {
		let id: WeaponSkillID;

		if ('SHIELD_LARGE' === offHand.id) {
			id = 'SHD_LARGE_BLOCK';
		} else {
			id = 'SHD_SMALL_BLOCK';
		}
		const skill = new Skill(id);
		const mod = skill.block ? skill.block.modifier : 1;
		const block = (offHand.block || 0) * mod;
		const title = `${skill.title} ${block}`;

		const cmd = new Command('REACTION', title, character, [skill]);

		if (cmd.isActive() && isBackAttack) {
			cmd.setActive('CANT_ACT');
		}
		commands.push(cmd);
	}

	// armor reaction skills
	for (const skillID of armor.skills) {
		const skill = new Skill(skillID);
		let { title } = skill;

		if ('AETHERSHIELD' === skillID) {
			title += ' ' + MP;
		}
		const cmd = new Command('REACTION', title, character, [skill]);

		if (isBackAttack) {
			cmd.setActive('CANT_ACT');
		}
		switch (skillID) {
			case 'EVADE':
				if (cmd.isActive() && (!canMove || !canEvade)) {
					cmd.setActive('CANT_ACT');
				}
				break;

			case 'AETHERSHIELD':
				if (cmd.isActive() && 0 === MP) {
					cmd.setActive('OUT_OF_MP');
				}
				if (cmd.isActive() && isSilenced) {
					cmd.setActive('SILENCED');
				}
				break;

			default:
				// do nothing
		}

		commands.push(cmd);
	}

	// PASS command
	commands.push(getDontReactCommand());

	return commands;
};

export const getEvasiveCommands = (): Command[] => [getCancelCommand()];
