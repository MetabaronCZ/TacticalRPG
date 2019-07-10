import React from 'react';

import { gridSize } from 'data/game-config';

import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import { getTiles } from 'modules/geometry/tiles';

const itemSize = 100 / gridSize;

interface IGridBaseProps {
	act: Act | null;
	onSelect: (tile: Tile) => void;
}

type TileType =
	'default' |
	'movable' | 'movePath' | 'moveTarget' |
	'commandRange' | 'commandTargetable' |
	'commandEffectArea' | 'commandEffectTargets' | 'commandEffectTarget' |
	'reactors' | 'reactionEvasible' | 'reactor' |
	'directable' | 'directTarget';

const getTileType = (tile: Tile, act: Act | null): TileType => {
	let type: TileType = 'default';

	if (!act) {
		return type;
	}
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

const GridBase: React.SFC<IGridBaseProps> = ({ act, onSelect }) => {
	const tiles = getTiles().map(tile => {
		return [tile, getTileType(tile, act)] as [Tile, TileType];
	});

	const actingChar = act ? act.getActingCharacter() : null;

	const onClick = (tile: Tile) => () => {
		if (actingChar && !actingChar.isAI()) {
			onSelect(tile);
		}
	};

	return (
		<div className="GridTiles">
			{tiles.map(([tile, type], i) => {
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
					/>
				);
			})}
		</div>
	);
};

export default GridBase;
