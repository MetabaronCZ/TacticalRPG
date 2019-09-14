import { sqrt3 } from 'core/number';

import colors from 'data/colors';
import { characterPositions } from 'data/grid';

import { Color } from 'modules/color';
import Tile from 'modules/geometry/tile';
import { IActState } from 'modules/battle/act';
import { ICharacter } from 'modules/character';
import { getSafeTile } from 'modules/geometry/tiles';

type TileColors = 'default' | 'green' | 'blue' | 'yellow';
type CharacterColors = 'grey' | 'violet' | 'orange';

export interface ITileCoords {
	x: number;
	y: number;
}

type ColorStyle = [Color, Color];

type TileStyles = {
	[id in TileColors]: ColorStyle;
};

type CharacterStyles = {
	[id in CharacterColors]: ColorStyle;
};

interface IHexDimensions {
	width: number;
	height: number;
}

// tile colors
export const tileStyles: TileStyles = {
	default: [colors.greyDark, colors.greyDarker],
	green: [colors.green, colors.greenLight],
	blue: [colors.blue, colors.blueLight],
	yellow: [colors.yellow, colors.yellowLight]
};

// character colors
export const characterStyles: CharacterStyles = {
	grey: [colors.grey, colors.greyDark],
	violet: [colors.violet, colors.violetDark],
	orange: [colors.orange, colors.orangeDark]
};

export const getTileStyle = (tile: Tile, act: IActState): ColorStyle => {
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
				if (tile.isContained(reaction.evasible)) {
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

export const getCharacterStyle = (character: ICharacter, isActor: boolean): ColorStyle => {
	let style = characterStyles.grey;

	if (character.dying) {
		return style;
	}

	if (0 === character.player) {
		style = characterStyles.violet;
	} else {
		style = characterStyles.orange;
	}
	if (isActor) {
		return [style[0], colors.yellowLight];
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
