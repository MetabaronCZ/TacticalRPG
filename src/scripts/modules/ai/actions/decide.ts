import { getIntersection } from 'core/array';

import { getCombatInfo } from 'modules/battle/combat';
import { getShortestPath } from 'modules/pathfinding';
import { getIdleCommands } from 'modules/battle/commands';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

interface IAction {
	readonly character: Character;
	readonly command: Command;
	readonly move: Tile;
	readonly cost: {
		AP: number;
		MP: number;
	};
	readonly damage: number;
	readonly distance: number;
}

interface IDistances {
	[characterID: string]: number;
}

const btDecide = (): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.decision) {
			Logger.info('AI INIT - already has target');
			return 'SUCCESS';
		}
		const passCommand = data.commands.find(cmd => 'PASS' === cmd.type);

		if (!passCommand) {
			throw new Error('Could not init AI: pass command not available');
		}
		const { movable, costMap } = data.act.phases.MOVEMENT;
		const { enemy, obstacles } = data.memory;

		const { actor } = data.act;
		const { AP } = actor.attributes;
		const actions: IAction[] = [];

		// gather information
		for (const tile of movable) {
			const moveCost = costMap[tile.id];
			const ap = Math.max(0, AP - moveCost);

			// create actor shadow on given tile
			const char = actor.clone();
			char.position = tile;
			char.attributes.set('AP', ap);

			// get shortest possible paths / distances to all targets
			const distances: IDistances = {};

			for (const tgt of enemy) {
				const path = getShortestPath(tile, tgt.position, []);

				const distance = path.length;
				distances[tgt.data.id] = distance;

				// add simple go-and-pass item
				actions.push({
					character: tgt,
					move: tile,
					command: passCommand,
					damage: 0,
					distance,
					cost: {
						AP: moveCost,
						MP: 0
					}
				});
			}

			// get actual commands on given tile
			const commands = getIdleCommands(char);

			// gather actions character can do
			for (const command of commands) {
				const { cost, skills } = command;

				if (!command.isActive() || (cost && ap - cost.AP < 0) || !skills.length) {
					continue;
				}
				const skillTarget = skills[0].target;

				if ('ENEMY' !== skillTarget && 'ANY' !== skillTarget) {
					continue;
				}
				const skillAreas = skills.map(skill => skill.getTargetable(char.position, obstacles));
				const targetable = getIntersection(skillAreas);
				const targets = skills[0].getTargets(char, enemy, targetable);

				for (const tgt of targets) {
					const distance = distances[tgt.data.id];
					let damage = 0;

					for (const skill of skills) {
						const combatInfo = getCombatInfo(char, tgt, skill);
						damage += combatInfo.damage;
					}
					actions.push({
						character: tgt,
						move: tile,
						command,
						damage,
						distance,
						cost: {
							AP: moveCost + (cost ? cost.AP : 0),
							MP: (cost ? cost.MP : 0)
						}
					});
				}
			}
		}

		// tertiary sort (by shortest travel distance)
		let sorted = actions.sort((a, b) => a.distance - b.distance);

		// secondary sort (by most potentional damage done)
		sorted = actions.sort((a, b) => b.damage - a.damage);

		// primary sort (by minimal % of enemy health remaining)
		sorted = actions.sort((a, b) => {
			const hpA = a.character.attributes.HP;
			const hpB = b.character.attributes.HP;
			const hpMaxA = a.character.baseAttributes.HP;
			const hpMaxB = b.character.baseAttributes.HP;

			const remainingA = Math.max(0, hpA - a.damage) / hpMaxA;
			const remainingB = Math.max(0, hpB - b.damage) / hpMaxB;

			return remainingA - remainingB;
		});

		// prioritize item which deals most percentual damage to a target
		const target = sorted[0] || null;

		if (target) {
			const { character, move, command } = target;

			data.memory.decision = {
				target: character.position,
				command,
				move
			};
			Logger.info(`AI INIT - target: ${character.name}, move: ${move.id}, command: ${command.title}`);

		} else {
			data.memory.decision = null;
			Logger.info('AI INIT - no target found');
		}

		return 'SUCCESS';
	});
};

export default btDecide;
