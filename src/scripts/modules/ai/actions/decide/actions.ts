import { MAX_NUMBER } from 'core/number';
import { getIntersection } from 'core/array';

import { getCombatInfo } from 'modules/battle/combat';
import { getIdleCommands } from 'modules/battle/commands';
import { getShortestPath } from 'modules/pathfinding/shortest-path-breadth-first';

import Tile from 'modules/geometry/tile';
import Player from 'modules/battle/player';
import Command from 'modules/battle/command';
import { IAIData } from 'modules/ai/character';
import StatusEffect from 'modules/battle/status-effect';
import Character, { ICharacterSnapshot } from 'modules/character';

interface IDistances {
	[characterID: string]: number;
}

interface IActionTarget<T> {
	readonly character: T;
	readonly player: number;
	readonly position: Tile;
	readonly distance: number;
}

interface IActionBase<T> {
	readonly target: IActionTarget<T>;
	readonly command: Command;
	readonly move: Tile;
	readonly cost: {
		AP: number;
		MP: number;
	};
	readonly damage: number;
	readonly healing: number;
	readonly status: StatusEffect[];
	readonly closestAlly: number;
	readonly closestEnemy: number;
}

type IAnonymousAction = IActionBase<string>;
export type IAction = IActionBase<ICharacterSnapshot>;

export const getActions = (data: IAIData): IAction[] => {
	const { act, ally, enemy, obstacles } = data;
	const { actor, phases } = act;
	const { movable, costMap } = phases.MOVEMENT;
	const characters = ally.concat(enemy).filter(char => !char.dead && !char.dying);

	// create Player shadows
	const playerShadow = Player.from(actor.player);
	const enemyPlayerShadow = Player.from(enemy[0].player);

	// create character shadows
	const charShadows = characters.map(char => {
		const pl = (actor.player.id === char.player.id ? playerShadow : enemyPlayerShadow);
		return Character.from(char, pl);
	});

	const { AP } = actor.attributes;
	const actions: IAnonymousAction[] = [];

	// gather possible actions
	for (const tile of movable) {
		const moveCost = costMap[tile.id];
		const ap = Math.max(0, AP - moveCost);

		// create actor shadow on given tile
		const char = Character.from(actor, playerShadow);
		char.position = tile;
		char.attributes.set('AP', ap);

		// get distances to all targets
		const distances: IDistances = {};
		let closestAlly = MAX_NUMBER;
		let closestEnemy = MAX_NUMBER;

		for (const ch of characters) {
			const path = getShortestPath(tile, ch.position, []);

			const distance = path.length;
			distances[ch.id] = distance;

			if (actor.player.id !== ch.player.id) {
				if (distance < closestEnemy) {
					closestEnemy = distance;
				}
			} else {
				if (distance < closestAlly && actor.id !== ch.id) {
					closestAlly = distance;
				}
			}
		}

		// get actual commands on given tile
		const commands = getIdleCommands(char);

		// gather actions character can do
		for (const command of commands) {
			const { cost, skills } = command;

			if (!command.isActive() || (cost && ap - cost.AP < 0)) {
				continue;
			}
			const newCost = {
				AP: moveCost + (cost ? cost.AP : 0),
				MP: (cost ? cost.MP : 0)
			};
			let targetable = [...charShadows];

			if (skills.length) {
				const skillAreas = skills.map(skill => skill.getTargetable(char.position, obstacles));
				const skillArea = getIntersection(skillAreas);
				targetable = skills[0].getTargets(char, charShadows, skillArea);
			}

			for (const tgt of targetable) {
				const { id } = tgt;
				const distance = distances[id];
				let tgtPosition = tgt.position;

				if (id === actor.id) {
					// target its future position
					tgtPosition = tile;
				}
				let damage = 0;
				let healing = 0;
				let status: StatusEffect[] = [];

				for (const skill of skills) {
					const effectArea = skill.getEffectArea(actor.position, tgtPosition);
					const effectTargets = skill.getTargets(char, charShadows, effectArea);
			
					effectTargets.forEach(eff => {
						const combatInfo = getCombatInfo(char, eff, skill);
						damage += combatInfo.damage;
						healing += combatInfo.healing;
						status = [...status, ...combatInfo.status];
					});
				}

				actions.push({
					target: {
						character: id,
						player: tgt.player.id,
						position: tgtPosition,
						distance
					},
					move: tile,
					command,
					damage,
					healing,
					status,
					closestAlly,
					closestEnemy,
					cost: newCost
				});
			}
		}
	}

	const possibleActions: IAction[] = actions.map(action => {
		const charID = action.target.character;
		const character = characters.find(char => charID === char.id);

		if (!character) {
			throw new Error('Could not convert action item: Invalid character ID');
		}
		return {
			...action,
			target: {
				...action.target,
				character
			}
		} as IAction;
	});

	return possibleActions;
};
