import { getRandomItem, getIntersection } from 'core/array';
import { aiActionDelay } from 'data/game-config';

import { getShortestPath } from 'modules/pathfinding';
import { findTileFrom, resolveDirection, getOpositeDirection } from 'modules/geometry/direction';

import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import Character from 'modules/character';
import Engine from 'modules/battle/engine';
import CharacterRole from 'modules/ai/role';
import Command from 'modules/battle/command';
import { IActState } from 'modules/battle/act';

const delayAction = (fn: () => void): void => {
	setTimeout(() => fn(), aiActionDelay);
};

type TargetSide = 'FRONT' | 'SIDE' | 'BEHIND';

interface ITargetInfo {
	readonly character: Character;
	readonly side: TargetSide;
	readonly path: Tile[];
}

const getSide = (char: Character, tile: Tile): TargetSide => {
	const { position, direction } = char;

	const front = direction;
	const behind = getOpositeDirection(direction);

	if (tile === findTileFrom(position, front)) {
		return 'FRONT';
	}
	if (tile === findTileFrom(position, behind)) {
		return 'BEHIND';
	}
	return 'SIDE';
};

class AICharacter {
	public readonly character: Character;
	public readonly role: CharacterRole;

	private moved = false;
	private target: Character | null = null; // skill target character

	private selectTile: (tile: Tile) => void;
	private selectCommand: (cmd: Command) => void;

	constructor(character: Character, engine: Engine, role: CharacterRole) {
		this.character = character;
		this.role = role;

		this.selectTile = (tile: Tile) => {
			delayAction(() => engine.selectTile(tile));
		};

		this.selectCommand = (cmd: Command) => {
			delayAction(() => engine.selectCommand(cmd));
		};
	}

	public update(act: IActState, commands: Command[]): void {
		const { MOVEMENT, COMMAND, REACTION, DIRECTION } = act.phases;

		switch (act.phase) {
			case 'MOVEMENT': {
				const { phase, movable } = MOVEMENT;

				if ('IDLE' === phase) {
					this.onCommand(commands, movable);
				}
				return;
			}

			case 'COMMAND': {
				const { phase, target, targetable } = COMMAND;

				switch (phase) {
					case 'TARGETING':
						if (target) {
							// confirm selected command
							const confirm = commands.find(cmd => 'CONFIRM' === cmd.type);

							if (!confirm) {
								throw new Error('AI character commands does not contain confirm command');
							}
							this.selectCommand(confirm);

						} else {
							// target selected command skill
							this.onCommandTarget(targetable);
						}
						return;

					default:
						return; // do nothing
				}
			}

			case 'REACTION': {
				const { reaction } = REACTION;

				if (!reaction) {
					throw new Error('AI Could not react: invalid reaction');
				}
				const { phase, combat, evasible } = reaction;

				switch (phase) {
					case 'IDLE':
						this.onReaction(commands, combat[0].backAttack);
						return;

					case 'EVASION':
						this.onEvasion(evasible);
						return;

					default:
						return; // do nothing
				}
			}

			case 'DIRECTION': {
				const { directable } = DIRECTION;
				this.onDirect(directable);
				return;
			}

			default:
				return; // do nothing
		}
	}

	public onCommand(commands: Command[], movable: Tile[]): void {
		const char = this.character;

		if (char.isDead()) {
			return;
		}
		const player = char.player as AIPlayer;
		const obstacles = player.getObstacles();
		const enemy = player.getEnemy();

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
					const sideTiles = e.position.getNeighbours();

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
						return !!path && 'BEHIND' === path.side;
					});

					const sidePaths: ITargetInfo[] = paths.filter((path): path is ITargetInfo => {
						return !!path && 'SIDE' === path.side;
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
						this.selectTile(moveTarget);
						return;
					}
				}
			}
		}
		this.chooseCommand(commands);
	}

	public onCommandTarget(targetable: Tile[]): void {
		let target = this.target ? this.target.position : null;

		if (!target || !target.isContained(targetable)) {
			target = getRandomItem(targetable);
		}

		if (!target || !target.isContained(targetable)) {
			throw new Error('AI character couold not target skill: no targetable tiles');
		}
		this.selectTile(target);
	}

	public onReaction(commands: Command[], isBackAttacked: boolean): void {
		const passCommand = commands.find(act => 'DONT_REACT' === act.type);

		if (!passCommand) {
			throw new Error('AI character commands does not contain pass command');
		}
		const char = this.character;

		if (isBackAttacked || !char.canAct()) {
			this.selectCommand(passCommand);
			return;
		}
		const player = this.character.player as AIPlayer;
		const obstacles = player.getObstacles();

		// find first applicable reaction
		for (const command of commands) {
			if (!command.skills.length || !command.isActive()) {
				continue;
			}
			const skill = command.skills[0];

			if ('EVADE' === skill.id) {
				// get evasible tiles
				const evasible = char.position.getNeighbours(obstacles);

				if (!evasible.length) {
					continue;
				}
			}
			this.selectCommand(command);
			return;
		}

		// no reaction available
		this.selectCommand(passCommand);
	}

	public onEvasion(evasible: Tile[]): void {
		const evasionTarget = getRandomItem(evasible);

		if (!evasionTarget) {
			throw new Error('AI character could not react: no evasion targets');
		}
		this.selectTile(evasionTarget);
	}

	public onDirect(directable: Tile[]): void {
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
		this.selectTile(directTarget);
	}

	private chooseCommand(commands: Command[]): void {
		const passCommand = commands.find(act => 'PASS' === act.type);

		if (!passCommand) {
			throw new Error('AI character commands does not contain pass command');
		}
		const char = this.character;
		const pos = char.position;

		const player = char.player as AIPlayer;
		const ally = player.getCharacters();
		const enemy = player.getEnemy();

		// reset move state
		this.moved = false;

		if (!this.target || !char.canAct()) {
			this.selectCommand(passCommand);
			return;
		}

		// find first skill to attack chosen target
		for (const command of commands) {
			if (!command.skills.length || !command.isActive()) {
				continue;
			}
			const skillTarget = command.skills[0].target;

			if ('ENEMY' !== skillTarget && 'ANY' !== skillTarget) {
				// ignore non applicable skills
				continue;
			}
			const obstacles = ally.map(a => a.position);
			const skillAreas = command.skills.map(skill => skill.getTargetable(pos, obstacles));
			const targetable = getIntersection(skillAreas);
			const targets = command.skills[0].getTargets(char, enemy, targetable);

			if (-1 !== targets.indexOf(this.target)) {
				this.selectCommand(command);
				return;
			}
		}

		// enemy is not targetable
		this.selectCommand(passCommand);
	}
}

export default AICharacter;
