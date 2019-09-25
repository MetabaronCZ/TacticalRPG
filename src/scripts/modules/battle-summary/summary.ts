import Skill from 'modules/skill';
import { IActRecord } from 'modules/battle/act';
import Command, { ICommandSnapshot } from 'modules/battle/command';
import { ICharacterData } from 'modules/character-creation/character-data';

import { formatCombatResult } from 'ui/format';

interface ISummaryItemMove {
	from: string;
	to: string;
}

interface ISummaryItemCommand {
	command: ICommandSnapshot;
	target: ICharacterData;
}

interface ISummaryItemReaction {
	command: ICommandSnapshot;
	reactor: ICharacterData;
}

export interface ISummaryItem {
	readonly id: number;
	readonly actor: ICharacterData;
	readonly skipped: boolean;
	move: ISummaryItemMove | null;
	command: ISummaryItemCommand | null;
	reactions: ISummaryItemReaction[];
	results: string[];
}

export const getSummaryItem = (characters: ICharacterData[], record: IActRecord): ISummaryItem => {
	const actor = characters.find(char => record.actor === char.id);

	if (!actor) {
		throw new Error('Invalid actor on timeline item ' + record.id);
	}
	const result: ISummaryItem = {
		id: record.id,
		actor,
		skipped: record.skipped,
		move: null,
		command: null,
		reactions: [],
		results: []
	};

	if (record.skipped) {
		return result;
	}
	const { movementPhase, commandPhase, reactionPhase, combatPhase } = record;

	if (movementPhase.initialPosition !== movementPhase.target) {
		result.move = {
			from: movementPhase.initialPosition,
			to: movementPhase.target
		};
	}

	if (commandPhase.command) {
		const { title, skills } = commandPhase.command;

		if (commandPhase.target) {
			const target = characters.find(char => commandPhase.target === char.id);

			if (!target) {
				throw new Error('Invalid character ID in record command target');
			}
			const command = new Command('ATTACK', title, undefined, skills.map(id => new Skill(id)));

			result.command = {
				command: command.serialize(),
				target
			};
		}
	}

	for (const reaction of reactionPhase.reactions) {
		const reactor = characters.find(char => reaction.reactor === char.id);

		if (!reactor) {
			throw new Error('Invalid reactor ID in record reaction');
		}
		if (reaction.command) {
			const { title, skills } = reaction.command;
			const cmd = new Command('REACTION', title, undefined, skills.map(id => new Skill(id)));

			result.reactions.push({
				command: cmd.serialize(),
				reactor
			});
		}
	}

	for (const item of combatPhase.results) {
		const txt = formatCombatResult(item);
		result.results.push(txt);
	}
	return result;
};
