import React from 'react';

import { gridSize } from 'data/game-config';

import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { getTiles } from 'modules/geometry/tiles';

import CharacterTooltip from 'ui/battle/CharacterTooltip';

const itemSize = 100 / gridSize;
const tileList = getTiles();

interface IGridBaseProps {
	readonly act: Act;
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

export const getTileType = (tile: Tile, act: Act): TileType => {
	let type: TileType = 'default';

	switch (act.getPhase()) {
		case 'MOVEMENT': {
			const move = act.phases.MOVEMENT;
			const tgt = move.getTarget();

			if (tile.isContained(move.getMovable())) {
				type = 'movable';
			}
			if (tile.isContained(move.getPath())) {
				type = 'movePath';
			}
			if (tile === tgt) {
				type = 'moveTarget';
			}
			break;
		}

		case 'COMMAND': {
			const commandPhase = act.phases.COMMAND;

			if ('TARGETING' === commandPhase.getPhase()) {
				const tgt = commandPhase.getTarget();

				if (tgt) {
					// command with target selected
					if (tile.isContained(commandPhase.getEffectArea())) {
						type = 'commandEffectArea';
					}
					if (tile.isContained(commandPhase.getTargetable())) {
						type = 'commandTargetable';
					}
					if (tile === tgt) {
						type = 'commandEffectTarget';
					}

				} else {
					// command without target selected
					if (tile.isContained(commandPhase.getArea())) {
						type = 'commandRange';
					}
					if (tile.isContained(commandPhase.getTargetable())) {
						type = 'commandTargetable';
					}
				}
			}
			break;
		}

		case 'REACTION': {
			const reactionPhase = act.phases.REACTION;
			const reaction = reactionPhase.getReaction();

			if (reaction) {
				const { reactor } = reaction;
				const reactors = reactionPhase.getReactions().map(r => r.reactor.position);

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
			const direct = act.phases.DIRECTION;
			const tgt = direct.getTarget();

			if (tile.isContained(direct.getDirectable())) {
				type = 'directable';
			}
			if (tile === tgt) {
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

	const actingChar = act.getActingCharacter();

	const onClick = (tile: Tile) => () => {
		if (actingChar && !actingChar.isAI()) {
			onSelect(tile);
		}
	};
	return (
		<div className="GridTiles">
			{tiles.map(([tile, type, char], i) => {
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
						key={i}
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
