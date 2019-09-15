import { getIntersection } from 'core/array';

import { getCombatInfo } from 'modules/battle/combat';
import { getShortestPath } from 'modules/pathfinding';
import { getIdleCommands } from 'modules/battle/commands';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Command from 'modules/battle/command';
import { IAIData } from 'modules/ai/character';
import Character, { ICharacter } from 'modules/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';
import { PlayerData } from 'modules/battle-configuration/player-data';
import Player from 'modules/battle/player';

interface IActionBase {
	readonly command: Command;
	readonly move: Tile;
	readonly cost: {
		AP: number;
		MP: number;
	};
	readonly damage: number;
	readonly distance: number;
}

interface IAction extends IActionBase {
	readonly character: ICharacter;
}

interface IAnonymousAction extends IActionBase {
	readonly character: string;
}

interface IDistances {
	[characterID: string]: number;
}

const getPlayerShadow = (id: number, name: string): Player => {
	const data = new PlayerData(id, { name });
	return new Player(data, []);
};

const btDecide = (): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.decision) {
			Logger.info('AI DECIDE - already decided');
			return 'SUCCESS';
		}
		const passCommand = data.commands.find(cmd => 'PASS' === cmd.type);

		if (!passCommand) {
			throw new Error('Could not start AI decision: pass command not available');
		}
		const { act, enemy, obstacles } = data;
		const { actor, phases } = act;
		const { movable, costMap } = phases.MOVEMENT;

		// create Player shadows
		const playerShadow = getPlayerShadow(actor.player, 'SHADOW_ALLY');
		const enemyPlayerShadow = getPlayerShadow(enemy[0].player, 'SHADOW_ENEMY');

		// create enemy character shadows
		const enemyShadows = enemy.map(data => Character.from(data, enemyPlayerShadow));

		const { AP } = actor.attributes;
		const actions: IAnonymousAction[] = [];

		// gather information
		for (const tile of movable) {
			const moveCost = costMap[tile.id];
			const ap = Math.max(0, AP - moveCost);

			// create actor shadow on given tile
			const char = Character.from(actor, playerShadow);
			char.position = tile;
			char.attributes.set('AP', ap);

			// get shortest possible paths / distances to all targets
			const distances: IDistances = {};

			for (const tgt of enemyShadows) {
				const path = getShortestPath(tile, tgt.position, []);
				const { id } = tgt.data;

				const distance = path.length;
				distances[id] = distance;

				// add simple go-and-pass item
				actions.push({
					character: id,
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
				const targets = skills[0].getTargets(char, enemyShadows, targetable);

				for (const tgt of targets) {
					const { id } = tgt.data;
					const distance = distances[id];

					let damage = 0;

					for (const skill of skills) {
						const combatInfo = getCombatInfo(char, tgt, skill);
						damage += combatInfo.damage;
					}
					actions.push({
						character: id,
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

		let sorted: IAction[] = actions.map(action => {
			const character = enemy.find(char => action.character === char.id);

			if (!character) {
				throw new Error('Could not convert action item: Invalid character ID');
			}
			return { ...action, character } as IAction;
		});

		// tertiary sort (by shortest travel distance)
		sorted = sorted.sort((a, b) => a.distance - b.distance);

		// secondary sort (by most potentional damage done)
		sorted = sorted.sort((a, b) => b.damage - a.damage);

		// primary sort (by minimal % of enemy health remaining after command usage)
		sorted = sorted.sort((a, b) => {
			const charA = a.character;
			const charB = b.character;
			const hpA = charA.attributes.HP;
			const hpB = charB.attributes.HP;
			const hpMaxA = charA.baseAttributes.HP;
			const hpMaxB = charB.baseAttributes.HP;

			const remainingA = (hpA > a.damage ? hpA - a.damage : 0) / hpMaxA;
			const remainingB = (hpB > b.damage ? hpB - b.damage : 0) / hpMaxB;

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
			Logger.info(`AI DECIDE - target: ${character.name}, move: ${move.id}, command: ${command.title}`);

		} else {
			data.memory.decision = null;
			Logger.info('AI DECIDE - no target found');
		}

		return 'SUCCESS';
	});
};

export default btDecide;
