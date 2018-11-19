import { getIntersection, getRandomItem } from 'core/array';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Player from 'modules/battle/player';
import { IAIConfig } from 'modules/ai/settings';
import CharacterAction from 'modules/battle/character-action';
import { ICostMap, getShortestPath } from 'modules/pathfinding';
import { resolveDirection, findTileFrom } from 'modules/geometry/direction';

type IOnTileSelect = (tile: Tile) => void;
type IOnActionSelect = (action: CharacterAction) => void;

interface IAIActStartData {
	actor: Character;
	actions: CharacterAction[];
	movable: Tile[];
	moveCostMap: ICostMap;
	onTileSelect: IOnTileSelect;
	onActionSelect: IOnActionSelect;
}

interface IAICharacter {
	character: Character;
	hasMoved: boolean;
	target: Character|null; // skill target character
}

class AI extends Player {
	// private readonly config: IAIConfig;
	private enemy?: Player|AI;
	private ally: IAICharacter[] = [];

	constructor(name: string, config: IAIConfig) {
		super(name);
		// this.config = config;
	}

	public setEnemy(enemy: Player|AI) {
		this.enemy = enemy;
	}

	public setCharacters(characters: Character[]) {
		super.setCharacters(characters);

		this.ally = this.characters.map(char => ({
			character: char,
			hasMoved: false,
			target: null
		} as IAICharacter));
	}

	public onAction(conf: IAIActStartData) {
		const { actor, actions, movable, onTileSelect, onActionSelect } = conf;
		const char = this.getCharacter(actor);

		if (!char.hasMoved) {
			char.hasMoved = true;

			// get closest enemy
			const pos = char.character.position;
			const obstacles = this.getObstacles();
			const enemy = this.enemy ? this.enemy.getCharacters() : [];
			const targets: Array<{ path: Tile[]; character: Character; }> = [];

			// find all paths to enemies
			enemy.forEach(e => {
				const sideTiles = e.position.getSideTiles();

				for (const tile of sideTiles) {
					if (!tile.isContained(obstacles)) {
						targets.push({
							path: getShortestPath(pos, tile, obstacles),
							character: e
						});
					}
				}
			});

			// find closest target
			const sortedTargets = targets.sort((a, b) => a.path.length - b.path.length);
			char.target = sortedTargets[0].character;

			const path = sortedTargets[0].path.slice(1); // path without actor position

			if (path.length) {
				const movePath = path.filter(tile => tile.isContained(movable));
				const moveTarget = movePath[movePath.length - 1];

				onTileSelect(moveTarget);
				return;
			}
		}

		this.selectAction(char, actions, onActionSelect);
	}

	public onActionTarget(actor: Character, targetable: Tile[], onSelect: IOnTileSelect) {
		const char = this.getCharacter(actor);
		let target: Tile|null = null;

		if (char.target) {
			target = char.target.position;
		}
		if (!target || !target.isContained(targetable)) {
			target = getRandomItem(targetable);
		}

		if (!target || !target.isContained(targetable)) {
			throw new Error('AI character couold not target skill: no targetable tiles');
		}
		onSelect(target);
	}

	public onActionConfirm(actions: CharacterAction[], onSelect: IOnActionSelect) {
		const confirmAction = actions.find(act => 'CONFIRM' === act.id);

		if (!confirmAction) {
			throw new Error('AI character actions does not contain confirm action');
		}
		onSelect(confirmAction);
	}

	public onReaction(reactor: Character, actions: CharacterAction[], isBackAttacked: boolean, onSelect: IOnActionSelect) {
		const passAction = actions.find(act => 'DONT_REACT' === act.id);

		if (!passAction) {
			throw new Error('AI character actions does not contain pass action');
		}
		if (isBackAttacked) {
			onSelect(passAction);
			return;
		}
		const ap = reactor.attributes.AP;

		// find first applicable reaction
		for (const action of actions) {
			if (!action.skills.length || !action.isActive || action.cost > ap) {
				continue;
			}
			const skill = action.skills[0];

			if ('EVADE' === skill.id) {
				// get evasible tiles
				const obstacles = this.getObstacles();
				const evasible = reactor.position.getSideTiles(obstacles);

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

	public onDirect(actor: Character, directable: Tile[], onSelect: IOnTileSelect) {
		const char = this.getCharacter(actor);
		const pos = actor.position;
		let dir = actor.direction;

		if (char.target) {
			dir = resolveDirection(pos, char.target.position);
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

	private selectAction(actor: IAICharacter, actions: CharacterAction[], onSelect: IOnActionSelect) {
		const passAction = actions.find(act => 'PASS' === act.id);

		if (!passAction) {
			throw new Error('AI character actions does not contain pass action');
		}
		const target = actor.target;

		if (!target) {
			onSelect(passAction);
			return;
		}
		const enemy = this.enemy ? this.enemy.getCharacters() : [];
		const char = actor.character;
		const pos = char.position;
		const ap = char.attributes.AP;

		// find first skill to attack chosen target
		for (const action of actions) {
			if (!action.skills.length || !action.isActive || action.cost > ap) {
				continue;
			}
			const skillTarget = action.skills[0].target;

			if ('ENEMY' !== skillTarget && 'ANY' !== skillTarget) {
				// ignore non applicable skills
				continue;
			}
			const skillAreas = action.skills.map(skill => skill.getTargetable(pos));
			const targetable = getIntersection(skillAreas, p => p.id);
			const targets = action.skills[0].getTargets(char, enemy, targetable);

			if (-1 !== targets.indexOf(target)) {
				onSelect(action);
				return;
			}
		}

		// enemy is not targetable
		onSelect(passAction);
	}

	private getCharacter(actor: Character): IAICharacter {
		const char = this.ally.find(ch => ch.character === actor);

		if (!char) {
			throw new Error('Actor is not an AI');
		}
		return char;
	}

	private getObstacles(): Tile[] {
		const enemy = this.enemy ? this.enemy.getCharacters() : [];
		return [
			...this.ally.map(ch => ch.character.position),
			...enemy.map(ch => ch.position)
		];
	}
}

export default AI;
