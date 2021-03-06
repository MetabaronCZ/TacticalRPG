import { sqrt3 } from 'core/number';

import { characterPositions } from 'data/grid';
import { tileStyles, characterStyles } from 'data/styles';

import { Color } from 'modules/color';
import Tile from 'modules/geometry/tile';
import { IActSnapshot } from 'modules/battle/act';
import { getSafeTile } from 'modules/geometry/tiles';
import { ICharacterSnapshot } from 'modules/character';

export type TileColors = 'default' | 'green' | 'blue' | 'yellow' | 'highlighted' | 'destroyed';
export type CharacterColors = 'grey' | 'violet' | 'orange' | 'highlighted';

export interface ITileCoords {
	readonly x: number;
	readonly y: number;
}

// [background, border]
export type ColorStyle = [Color, Color];

interface IHexDimensions {
	readonly width: number;
	readonly height: number;
}

export const getTileStyle = (tile: Tile, act: IActSnapshot): ColorStyle => {
	const { MOVEMENT, COMMAND, REACTION, DIRECTION } = act.phases;

	switch (act.phase) {
		case 'MOVEMENT': {
			const { movable, moveTarget, movePath } = MOVEMENT;

			if (tile === moveTarget) {
				return tileStyles.yellow;
			}
			if (tile.isContained(movePath)) {
				return tileStyles.blue;
			}
			if (tile.isContained(movable)) {
				return tileStyles.green;
			}
			break;
		}

		case 'COMMAND': {
			const { phase, targetable, area, target, effectArea } = COMMAND;

			if ('TARGETING' === phase) {
				if (target) {
					// command with target selected
					if (tile === target) {
						return tileStyles.yellow;
					}
					if (tile.isContained(targetable)) {
						return tileStyles.blue;
					}
					if (tile.isContained(effectArea)) {
						return tileStyles.green;
					}

				} else {
					// command without target selected
					if (tile.isContained(targetable)) {
						return tileStyles.blue;
					}
					if (tile.isContained(area)) {
						return tileStyles.green;
					}
				}
			}
			break;
		}

		case 'REACTION': {
			const { reaction, reactions } = REACTION;

			if (reaction) {
				const { reactor } = reaction;
				const reactors = reactions.map(r => r.reactor.position);

				if (tile === reactor.position) {
					return tileStyles.yellow;
				}
				if ('EVASION' === reaction.phase && tile.isContained(reaction.evasible)) {
					return tileStyles.green;
				}
				if (tile.isContained(reactors)) {
					return tileStyles.blue;
				}
			}
			break;
		}

		case 'DIRECTION': {
			const { target, directable } = DIRECTION;

			if (tile === target) {
				return tileStyles.yellow;
			}
			if (tile.isContained(directable)) {
				return tileStyles.green;
			}
			break;
		}
	}
	return tileStyles.default;
};

export const getCharacterStyle = (character: ICharacterSnapshot, isActor: boolean): ColorStyle => {
	let style = characterStyles.grey;

	if (character.dying) {
		return style;
	}

	if (0 === character.player.id) {
		style = characterStyles.violet;
	} else {
		style = characterStyles.orange;
	}
	if (isActor) {
		return [style[0], characterStyles.highlighted[1]];
	}
	return style;
};

// get width and height from its radius
export const getHexDimensions = (size: number): IHexDimensions => {
	return {
		width: 2 * size,
		height: sqrt3 * size
	};
};

// HexaGrid character positions per Player
export const getCharacterPositions = (): Tile[][] => {
	return characterPositions.map(player => {
		return player.map(([x, y, z]) => getSafeTile(x, y, z));
	});
};

export const getTileCoords = (tile: Tile, size: number, gridSize: number, gridMargin = 0): ITileCoords => {
	const { width, height } = getHexDimensions(size);
	const centerX = gridSize / 2;
	const centerY = gridSize / 2;

	return {
		x: gridMargin + centerX + (3 / 4) * width * tile.x,
		y: gridMargin + centerY - height * (tile.y + tile.x / 2)
	};
};
