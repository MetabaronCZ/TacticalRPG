import { MAX_NUMBER } from 'core/number';

import { getCombatInfo } from 'modules/battle/combat';
import { getIdleCommands } from 'modules/battle/commands';
import { getShortestPath } from 'modules/pathfinding/shortest-path-breadth-first';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Player from 'modules/battle/player';
import Command from 'modules/battle/command';
import { IAIData } from 'modules/ai/character';
import { StatusEffectID } from 'modules/battle/status-effect';
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
	readonly status: StatusEffectID[];
	readonly distances: IDistances;
	readonly closestAlly: number;
	readonly closestEnemy: number;
}

type IAnonymousAction = IActionBase<string>;
export type IAction = IActionBase<ICharacterSnapshot>;

export const getActions = (data: IAIData): IAction[] => {
	const { act, dangerousTiles, enemy, characters } = data;
	const { actor, phases } = act;
	const { movable, costMap } = phases.MOVEMENT;

	// create Player shadows
	const playerShadow = Player.from(actor.player);
	const enemyPlayerShadow = Player.from(enemy[0].player);

	// create character shadows
	const charShadows = characters.map(char => {
		const pl = (actor.player.id === char.player.id ? playerShadow : enemyPlayerShadow);
		return Character.from(char, pl);
	});

	const liveChars = charShadows.filter(char => !char.isDead() && !char.status.has('DYING'));
	let positions: Tile[] = [];

	if (actor.canMove) {
		// get safe position to move (not highlighted by sudden death)
		positions = movable.filter(tile => !tile.isContained(dangerousTiles));

		if (!positions.length) {
			positions = [...movable];
		}

	} else {
		Logger.info('AI decide - character can\'t move');
		positions = [actor.position];
	}
	const { AP } = actor.attributes;
	const actions: IAnonymousAction[] = [];

	// gather possible actions
	for (const tile of positions) {
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

		for (const ch of charShadows) {
			const path = getShortestPath(tile, ch.position, []);

			const distance = path.length;
			distances[ch.battleId] = distance;

			if (liveChars.includes(ch)) {
				// mark closest ally / enemy
				if (actor.player.id !== ch.player.id) {
					if (distance < closestEnemy) {
						closestEnemy = distance;
					}
				} else {
					if (distance < closestAlly && actor.battleId !== ch.battleId) {
						closestAlly = distance;
					}
				}
			}
		}

		// get actual commands on given tile
		const commands = getIdleCommands(char);

		if (!char.canAct()) {
			Logger.info('AI decide - character can\'t act');
			const passCommand = commands.find(cmd => 'PASS' === cmd.type);

			if (!passCommand) {
				throw new Error('Invalid AI commands: no pass action found');
			}
			actions.push({
				target: {
					character: char.battleId,
					player: char.player.id,
					position: tile,
					distance: 0
				},
				move: tile,
				command: passCommand,
				damage: 0,
				healing: 0,
				status: [],
				distances,
				closestAlly,
				closestEnemy,
				cost: {
					AP: 0,
					MP: 0
				}
			});

			continue;
		}

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
			let targetable = [...liveChars];

			if (skills.length) {
				const area = command.getSkillArea(char, charShadows);
				targetable = command.getSkillTargetable(char, charShadows, area);
			}

			for (const tgt of targetable) {
				const { battleId } = tgt;
				const distance = distances[battleId];
				let tgtPosition = tgt.position;

				if (battleId === actor.battleId) {
					// target its future position
					tgtPosition = tile;
				}
				let damage = 0;
				let healing = 0;
				let status: StatusEffectID[] = [];

				for (const skill of skills) {
					const effectArea = skill.getEffectArea(tile, tgtPosition);
					const effectTargets = skill.getTargets(char, charShadows, effectArea);

					effectTargets.forEach(eff => {
						const combatInfo = getCombatInfo(char, eff, skill);
						damage += combatInfo.damage;
						healing += combatInfo.healing;
						status = [...status, ...combatInfo.status.map(st => st.id)];
					});
				}

				actions.push({
					target: {
						character: battleId,
						player: tgt.player.id,
						position: tgtPosition,
						distance
					},
					move: tile,
					command,
					damage,
					healing,
					status,
					distances,
					closestAlly,
					closestEnemy,
					cost: newCost
				});
			}
		}
	}

	const possibleActions: IAction[] = actions.map(action => {
		const charID = action.target.character;
		const character = characters.find(char => charID === char.battleId);

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
