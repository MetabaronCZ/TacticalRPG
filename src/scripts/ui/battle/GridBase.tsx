import React from 'react';

import { gridSize } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { IActState } from 'modules/battle/act';
import { getTiles } from 'modules/geometry/tiles';

import CharacterTooltip from 'ui/battle/CharacterTooltip';

const itemSize = 100 / gridSize;
const tileList = getTiles();

interface IGridBaseProps {
	readonly act: IActState;
	readonly characters: Character[];
	readonly onSelect: (tile: Tile) => void;
}

type GridTile = [Tile, TileType, Character | null];

export type TileType =
	'default' |
	'movable' | 'movePath' | 'moveTarget' |
	'commandRange' | 'commandTargetable' |
	'commandEffectArea' | 'commandEffectTargets' | 'commandEffectTarget' |
	'reactors' | 'reactionEvasible' | 'reactor' |
	'directable' | 'directTarget';

export const getTileType = (tile: Tile, act: IActState): TileType => {
	const { MOVEMENT, COMMAND, REACTION, DIRECTION } = act.phases;

	let type: TileType = 'default';

	switch (act.phase) {
		case 'MOVEMENT': {
			const { movable, moveTarget, movePath } = MOVEMENT;

			if (tile.isContained(movable)) {
				type = 'movable';
			}
			if (tile.isContained(movePath)) {
				type = 'movePath';
			}
			if (tile === moveTarget) {
				type = 'moveTarget';
			}
			break;
		}

		case 'COMMAND': {
			const { phase, targetable, area, target, effectArea } = COMMAND;

			if ('TARGETING' === phase) {
				if (target) {
					// command with target selected
					if (tile.isContained(effectArea)) {
						type = 'commandEffectArea';
					}
					if (tile.isContained(targetable)) {
						type = 'commandTargetable';
					}
					if (tile === target) {
						type = 'commandEffectTarget';
					}

				} else {
					// command without target selected
					if (tile.isContained(area)) {
						type = 'commandRange';
					}
					if (tile.isContained(targetable)) {
						type = 'commandTargetable';
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

				if (tile.isContained(reactors)) {
					type = 'reactors';
				}
				if (tile.isContained(reaction.evasible)) {
					type = 'reactionEvasible';
				}
				if (tile === reactor.position) {
					type = 'reactor';
				}
			}
			break;
		}

		case 'DIRECTION': {
			const { target, directable } = DIRECTION;

			if (tile.isContained(directable)) {
				type = 'directable';
			}
			if (tile === target) {
				type = 'directTarget';
			}
			break;
		}
	}

	return type;
};

const GridBase: React.SFC<IGridBaseProps> = ({ act, characters, onSelect }) => {
	const tiles: GridTile[] = tileList.map(tile => {
		const char = characters.find(ch => tile === ch.position) || null;
		return [tile, getTileType(tile, act), char];
	});

	const actingChar = act.actingCharacter;

	const onClick = (tile: Tile) => () => {
		if (actingChar && !actingChar.isAI()) {
			onSelect(tile);
		}
	};
	return (
		<div className="GridTiles">
			{tiles.map(([tile, type, char]) => {
				const { x, y } = tile;
				return (
					<div
						className={`GridTiles-item GridTiles-item--${type}`}
						style={
							{
								top: `${y * itemSize}%`,
								left: `${x * itemSize}%`,
								width: `${itemSize}%`,
								height: `${itemSize}%`,
							}
						}
						onClick={onClick(tile)}
						key={tile.id}
					>
						{!!char && (
							<div className="GridTiles-item-tooltip">
								<CharacterTooltip character={char} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default GridBase;
