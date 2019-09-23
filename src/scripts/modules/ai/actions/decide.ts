import { getIntersection } from 'core/array';

import Weapons from 'data/weapons';

import { getCombatInfo } from 'modules/battle/combat';
import { getShortestPath } from 'modules/pathfinding';
import { getIdleCommands } from 'modules/battle/commands';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Player from 'modules/battle/player';
import CharacterRole from 'modules/ai/role';
import Command from 'modules/battle/command';
import { IAIData } from 'modules/ai/character';
import StatusEffect from 'modules/battle/status-effect';
import Character, { ICharacterSnapshot } from 'modules/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const MAX_NUMBER = Number.MAX_SAFE_INTEGER;
const healingTreshold = 0.8; // maximum percent of target life remaining for healer to care

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
	readonly safeArea: number;
	readonly status: StatusEffect[];
}

type IAction = IActionBase<ICharacterSnapshot>;
type IAnonymousAction = IActionBase<string>;

interface IDistances {
	[characterID: string]: number;
}

const getCharacterHPRatio = (char: ICharacterSnapshot, damage = 0): number => {
	const hp = char.attributes.HP;
	const hpMax = char.baseAttributes.HP;
	return (hp > damage ? hp - damage : 0) / hpMax;
};

const sortByShortestTravel = (actions: IAction[]): IAction[] => {
	return actions.sort((a, b) => a.target.distance - b.target.distance);
};

const sortByMostSafeDistance = (actions: IAction[]): IAction[] => {
	return actions.sort((a, b) => b.safeArea - a.safeArea);
};

const sortByMostHealing = (actions: IAction[]): IAction[] => {
	return actions.sort((a, b) => b.healing - a.healing);
};

const sortByMostDamage = (actions: IAction[]): IAction[] => {
	return actions.sort((a, b) => b.damage - a.damage);
};

const sortByHPRemaining = (actions: IAction[], withDamage = false): IAction[] => {
	return actions.sort((a, b) => {
		const charA = a.target.character;
		const charB = b.target.character;
		const remainingA = getCharacterHPRatio(charA, withDamage ? a.damage : 0);
		const remainingB = getCharacterHPRatio(charB, withDamage ? b.damage : 0);
		return remainingA - remainingB;
	});	
};

const btDecide = (role: CharacterRole): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.decision) {
			Logger.info('AI DECIDE - already decided');
			return 'SUCCESS';
		}
		const { act, ally, enemy, obstacles } = data;
		const { actor, phases } = act;
		const { movable, costMap } = phases.MOVEMENT;
		const characters = ally.concat(enemy);

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

		// gather information
		for (const tile of movable) {
			const moveCost = costMap[tile.id];
			const ap = Math.max(0, AP - moveCost);

			// create actor shadow on given tile
			const char = Character.from(actor, playerShadow);
			char.position = tile;
			char.attributes.set('AP', ap);

			// get distances to possible targets / get safe distance
			const distances: IDistances = {};
			let safeArea = MAX_NUMBER;

			for (const char of characters) {
				const path = getShortestPath(tile, char.position, []);

				const distance = path.length;
				distances[char.data.id] = distance;

				if (char.id !== actor.id && distance < safeArea) {
					safeArea = distance;
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
					const { id } = tgt.data;
					const distance = distances[id];
					const tgtPosition = tgt.position;

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
						safeArea,
						status,
						cost: newCost
					});
				}
			}
		}

		const possibleActions: IAction[] = actions.map(action => {
			const charID = action.target.character;
			const playerID = action.target.player;

			const character = characters.find(char => {
				return charID === char.id && playerID === char.player.id;
			});

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

		const healingActions: IAction[] = [];
		const meleeActions: IAction[] = [];
		const rangedActions: IAction[] = [];
		const magicalActions: IAction[] = [];
		const effectActions: IAction[] = [];
		const passActions: IAction[] = [];

		// categorize actions
		for (const action of possibleActions) {
			const { skills } = action.command;

			// handle PASS actions
			if ('PASS' === action.command.type) {
				passActions.push(action);
				continue;
			}

			if (!skills.length) {
				// only PASS commands can have no skills
				throw new Error('Invalid command: No skills');
			}

			// handle healing actions
			if (action.healing > 0) {
				const ratio = getCharacterHPRatio(action.target.character);

				if (ratio < healingTreshold) {
					// action has meaningful healing
					healingActions.push(action);
				}
				continue;
			}

			// handle damaging actions
			if (action.damage > 0) {
				const weapons = skills.map(skill => Weapons.get(skill.weapon));
				const weaponTypes = weapons.map(weapon => weapon.type);
	
				const elements = skills.map(skill => skill.element)
					.filter(element => 'NONE' !== element);
	
				const hasRangedSkill = weaponTypes.includes('RANGED');
				const hasMagicalSkill = weaponTypes.includes('NONE');
				const hasElementalSkill = (elements.length > 0);
				const hasMeleeSkill = !!weaponTypes.find(type => 'NONE' !== type && 'RANGED' !== type);
				let categorized = false;
	
				if (hasRangedSkill) {
					rangedActions.push(action);
					categorized = true;
				}
	
				if (hasMagicalSkill || hasElementalSkill) {
					magicalActions.push(action);
					categorized = true;
				}
	
				if (hasMeleeSkill) {
					meleeActions.push(action);
					categorized = true;
				}

				if (!categorized) {
					throw new Error('Invalid AI action categorization: ' + action.command.title);
				}
				continue;
			}

			// handle buff / debuff effect actions
			if (action.status.length > 0) {
				effectActions.push(action);
				continue;
			}

			// action has no effect
		}

		if (!passActions.length) {
			throw new Error('Invalid AI commands: no pass action found');
		}
		const roles = role.get();
		let action: IAction | null = null;

		// get action according to actor role
		main: for (const r of roles) {
			switch (r) {
				case 'HEALER': {
					if (!healingActions.length) {
						// cant do any meaningful healing
						continue main;
					}
					let act: IAction[] = [...healingActions];

					// sort actions (prioritized)
					act = sortByMostSafeDistance(act);
					act = sortByMostHealing(act);
					act = sortByHPRemaining(act, false);

					// optimal healing action
					action = act[0];

					break main;
				}

				case 'MELEE': {
					if (!meleeActions.length) {
						// cant do any melee damage
						continue main;
					}
					let act: IAction[] = [...meleeActions];

					// sort actions (prioritized)
					act = sortByShortestTravel(act);
					act = sortByMostDamage(act);
					act = sortByHPRemaining(act, true);

					// optimal melee damage action
					action = act[0];

					break main;
				}

				case 'RANGER': {
					if (!rangedActions.length) {
						// cant do any ranged damage
						continue main;
					}
					let act: IAction[] = [...rangedActions];

					// sort actions (prioritized)
					act = sortByMostSafeDistance(act);
					act = sortByMostDamage(act);
					act = sortByHPRemaining(act, true);

					// optimal ranged damage action
					action = act[0];

					break main;
				}

				case 'MAGE': {
					if (!magicalActions.length) {
						// cant do any magical damage
						continue main;
					}
					let act: IAction[] = [...magicalActions];

					// sort actions (prioritized)
					act = sortByMostSafeDistance(act);
					act = sortByMostDamage(act);
					act = sortByHPRemaining(act, true);

					// optimal magical damage action
					action = act[0];

					break main;
				}

				default:
					throw new Error('Invalid character role: ' + r);
			}
		}

		if (!action) {
			// find best available move-and-pass action
			let act = [...passActions];

			let allyActions = act.filter(action => {
				return actor.player.id === action.target.character.player.id;
			});

			let enemyActions = act.filter(action => {
				return actor.player.id !== action.target.character.player.id;
			});

			if (!enemyActions.length) {
				throw new Error('AI could not decide action: No enemy');
			}

			switch (roles[0]) {
				case 'HEALER': {
					// get injured targets
					allyActions = allyActions.filter(action => {
						return 'OK' !== action.target.character.condition;
					});

					if (allyActions.length) {
						// go to closest injured ally
						allyActions = sortByMostSafeDistance(allyActions);
						allyActions = sortByShortestTravel(allyActions);
						action = allyActions[0];

					} else {
						// keep out of harm
						act = sortByMostSafeDistance(act);
						action = act[0];
					}
					break;
				}

				case 'MELEE':
				case 'RANGER':
				case 'MAGE': {
					// go to closest enemy
					enemyActions = sortByShortestTravel(enemyActions);
					action = enemyActions[0];
					break;
				}

				default:
					throw new Error('Invalid character role: ' + roles[0]);
			}
		}

		if (!action) {
			throw new Error('AI could not decide any action');
		}
		const { target, move, command } = action;
		const { position } = target;

		data.memory.decision = {
			move,
			command,
			target: position
		};
		const char = characters.find(char => position === char.position);

		Logger.info(`AI DECIDE - target: ${char ? char.name : '?????'} ${position.id}`);
		Logger.info(`AI DECIDE - move: ${move.id}`);
		Logger.info(`AI DECIDE - command: ${command.title}`);

		return 'SUCCESS';
	});
};

export default btDecide;
