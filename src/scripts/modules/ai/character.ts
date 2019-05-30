import { getRandomItem, getIntersection } from 'core/array';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { getShortestPath } from 'modules/pathfinding';
import CharacterAction from 'modules/battle/character-action';
import { IOnActionSelect, IOnTileSelect } from 'modules/ai/player';
import {
	findTileFrom, resolveDirection, getOpositeDirection
} from 'modules/geometry/direction';
import { canUseSkill } from 'modules/battle/character-actions';

interface IOnActionConf {
	actions: CharacterAction[];
	movable: Tile[];
	ally: Character[];
	enemy: Character[];
	obstacles: Tile[];
	onTileSelect: IOnTileSelect;
	onActionSelect: IOnActionSelect;
}

type TargetSide = 'FRONT' | 'SIDE' | 'BEHIND';

interface ITargetInfo {
	character: Character;
	side: TargetSide;
	path: Tile[];
}

const getSide = (char: Character, tile: Tile): TargetSide => {
	const pos = char.position;
	const front = char.direction;
	const behind = getOpositeDirection(char.direction);

	if (tile === findTileFrom(pos, front)) {
		return 'FRONT';
	}
	if (tile === findTileFrom(pos, behind)) {
		return 'BEHIND';
	}
	return 'SIDE';
};

class AICharacter {
	private character: Character;
	private moved = false;
	private target: Character | null = null; // skill target character

	constructor(character: Character) {
		this.character = character;
	}

	public getCharacter(): Character {
		return this.character;
	}

	public onAction(conf: IOnActionConf) {
		const { actions, movable, ally, enemy, obstacles, onTileSelect, onActionSelect } = conf;
		const char = this.character;

		if (char.isDead()) {
			return;
		}

		if (!this.moved) {
			this.moved = true;

			if (char.canMove()) {
				// get closest enemy
				const pos = char.position;
				let targets: ITargetInfo[] = [];

				// find all paths to enemies
				enemy.forEach(e => {
					if (e.isDead() || e.status.has('DYING')) {
						return;
					}
					const sideTiles = e.position.getSideTiles();

					const paths: Array<ITargetInfo | null> = sideTiles.map(tile => {
						if (tile.isContained(obstacles)) {
							return null;
						}
						let enemyPath: Tile[] | null = null;

						try {
							enemyPath = getShortestPath(pos, tile, obstacles);
						} catch (err) {
							// tile is not accessible
						}
						if (!enemyPath) {
							return null;
						}
						return {
							character: e,
							path: enemyPath,
							side: getSide(e, tile)
						};
					});

					const behindPaths: ITargetInfo[] = paths.filter((path): path is ITargetInfo => {
						return null !== path && 'BEHIND' === path.side;
					});

					const sidePaths: ITargetInfo[] = paths.filter((path): path is ITargetInfo => {
						return null !== path && 'SIDE' === path.side;
					});

					// prioritize paths leading behind enemy
					if (behindPaths.length) {
						targets = targets.concat(behindPaths);
					} else if (sidePaths.length) {
						targets = targets.concat(sidePaths);
					} else {
						const otherPaths = paths.filter((path): path is ITargetInfo => null !== path);
						targets = targets.concat(otherPaths);
					}
				});

				if (targets.length) {
					// find closest target
					const sortedTargets = targets.sort((a, b) => a.path.length - b.path.length);
					this.target = sortedTargets[0].character;

					const path = sortedTargets[0].path.slice(1); // path without actor position
					const movePath = path.filter(tile => tile.isContained(movable));

					if (movePath.length) {
						const moveTarget = movePath[movePath.length - 1];
						onTileSelect(moveTarget);
						return;
					}
				}
			}
		}

		this.selectAction(actions, ally, enemy, onActionSelect);
	}

	public onActionTarget(targetable: Tile[], onSelect: IOnTileSelect) {
		let target = this.target ? this.target.position : null;

		if (!target || !target.isContained(targetable)) {
			target = getRandomItem(targetable);
		}

		if (!target || !target.isContained(targetable)) {
			throw new Error('AI character couold not target skill: no targetable tiles');
		}
		onSelect(target);
	}

	public onReaction(actions: CharacterAction[], isBackAttacked: boolean, obstacles: Tile[], onSelect: IOnActionSelect) {
		const passAction = actions.find(act => 'DONT_REACT' === act.type);

		if (!passAction) {
			throw new Error('AI character actions does not contain pass action');
		}
		const char = this.character;
		const { AP, MP } = char.attributes;

		if (isBackAttacked || !char.canAct()) {
			onSelect(passAction);
			return;
		}

		// find first applicable reaction
		for (const action of actions) {
			if (!action.skills.length || !action.isActive() || !canUseSkill(action.cost, AP, MP)) {
				continue;
			}
			const skill = action.skills[0];

			if ('EVADE' === skill.id) {
				// get evasible tiles
				const evasible = char.position.getSideTiles(obstacles);

				if (!evasible.length) {
					continue;
				}
			}
			onSelect(action);
			return;
		}

		// no reaction available
		onSelect(passAction);
	}

	public onEvasion(evasible: Tile[], onSelect: IOnTileSelect) {
		const evasionTarget = getRandomItem(evasible);

		if (!evasionTarget) {
			throw new Error('AI character could not react: no evasion targets');
		}
		onSelect(evasionTarget);
	}

	public onDirect(directable: Tile[], onSelect: IOnTileSelect) {
		const char = this.character;

		if (char.isDead() || !char.canAct()) {
			return;
		}
		const pos = char.position;
		let dir = char.direction;

		if (this.target) {
			dir = resolveDirection(pos, this.target.position);
		}
		let directTarget = findTileFrom(pos, dir);

		if (!directTarget) {
			directTarget = getRandomItem(directable);
		}

		if (!directTarget) {
			throw new Error('AI could not direct');
		}
		onSelect(directTarget);
	}

	private selectAction(actions: CharacterAction[], ally: Character[], enemy: Character[], onSelect: IOnActionSelect) {
		const passAction = actions.find(act => 'PASS' === act.type);

		if (!passAction) {
			throw new Error('AI character actions does not contain pass action');
		}
		const char = this.character;
		const pos = char.position;
		const { AP, MP } = char.attributes;

		// reset move state
		this.moved = false;

		if (!this.target || !char.canAct()) {
			onSelect(passAction);
			return;
		}

		// find first skill to attack chosen target
		for (const action of actions) {
			if (!action.skills.length || !action.isActive() || !canUseSkill(action.cost, AP, MP)) {
				continue;
			}
			const skillTarget = action.skills[0].target;

			if ('ENEMY' !== skillTarget && 'ANY' !== skillTarget) {
				// ignore non applicable skills
				continue;
			}
			const obstacles = ally.map(a => a.position);
			const skillAreas = action.skills.map(skill => skill.getTargetable(pos, obstacles));
			const targetable = getIntersection(skillAreas, p => p.id);
			const targets = action.skills[0].getTargets(char, enemy, targetable);

			if (-1 !== targets.indexOf(this.target)) {
				onSelect(action);
				return;
			}
		}

		// enemy is not targetable
		onSelect(passAction);
	}
}

export default AICharacter;
