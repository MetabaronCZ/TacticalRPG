import { getIntersection } from 'core/array';

import { getCombatInfo } from 'modules/battle/combat';
import { getShortestPath } from 'modules/pathfinding';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';
import { CharacterData } from 'modules/character-creation/character-data';

interface ITargetInfo {
	readonly character: Character;
	readonly command: Command;
	readonly tile: Tile;
	readonly cost: {
		AP: number;
		MP: number;
	};
	readonly damage: number;
	readonly distance: number;
}

const btInit = (): BTAction<IAIData> => {
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
		const actorData = new CharacterData(actor.data);

		const targetInfo: ITargetInfo[] = [];

		// gather target information
		for (const tile of movable) {
			const moveCost = costMap[tile.id];
			const ap = Math.max(0, AP - moveCost);

			// create actor shadow on given tile
			const char = new Character(actorData, tile, actor.direction, actor.player);
			char.attributes.set('AP', ap);

			// usable commands
			const commands = data.commands.filter(cmd => {
				const { cost, skills } = cmd;

				if (!skills.length) {
					return;
				}
				const skillTarget = skills[0].target;

				return (
					cmd.isActive() &&
					(!cost || ap - cost.AP >= 0) &&
					('ENEMY' === skillTarget || 'ANY' === skillTarget)
				);
			});

			for (const tgt of enemy) {
				// get shortest possible path / distance to target
				const path = getShortestPath(tile, tgt.position, []);
				const distance = path.length;

				for (const command of commands) {
					const skillAreas = command.skills.map(skill => skill.getTargetable(char.position, obstacles));
					const targetable = getIntersection(skillAreas);
					const targets = command.skills[0].getTargets(char, enemy, targetable);

					if (-1 !== targets.indexOf(tgt)) {
						// command can be used on enemy
						let damage = 0;

						for (const skill of command.skills) {
							const combatInfo = getCombatInfo(char, tgt, skill);
							damage += combatInfo.damage;
						}
						targetInfo.push({
							character: tgt,
							tile,
							command,
							damage,
							distance,
							cost: {
								AP: moveCost + (command.cost ? command.cost.AP : 0),
								MP: (command.cost ? command.cost.MP : 0)
							}
						});
					}
				}

				// add simple go-and-pass item
				targetInfo.push({
					character: tgt,
					tile,
					command: passCommand,
					damage: 0,
					distance,
					cost: {
						AP: moveCost,
						MP: 0
					}
				});
			}
		}

		// tertiary sort (by shortest travel distance)
		let sorted = targetInfo.sort((a, b) => a.distance - b.distance);

		// secondary sort (by most potentional damage done)
		sorted = targetInfo.sort((a, b) => b.damage - a.damage);

		// primary sort (by minimal % of enemy health remaining)
		sorted = targetInfo.sort((a, b) => {
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
			const tgtTile = target.tile.id;
			const tgtName = target.character.name;
			const tgtCommand = target.command.title;

			data.memory.decision = {
				target: target.character.position,
				command: target.command,
				move: target.tile
			};
			Logger.info(`AI INIT - target: ${tgtName}, tile: ${tgtTile}, command: ${tgtCommand}`);

		} else {
			data.memory.decision = null;
			Logger.info('AI INIT - no target found');
		}

		return 'SUCCESS';
	});
};

export default btInit;
