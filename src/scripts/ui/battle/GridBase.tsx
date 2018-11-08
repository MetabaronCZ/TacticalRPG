import React from 'react';

import { gridSize } from 'data/game-config';

import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import { getTiles } from 'modules/geometry/tiles';

const itemSize = 100 / gridSize;

interface IGridBaseProps {
	act: Act|null;
	onSelect: (tile: Tile) => void;
}

type TileType =
	'default' |
	'movable' | 'movePath' | 'moveTarget' |
	'actionRange' | 'actionTargetable' |
	'actionEffectArea' | 'actionEffectTargets' | 'actionEffectTarget' |
	'reactors' | 'reactionEvasible' | 'reactor' |
	'directable' | 'directTarget';

const getTileType = (tile: Tile, act: Act|null): TileType => {
	let type: TileType = 'default';

	if (null === act) {
		return type;
	}
	switch (act.getPhase()) {
		case 'MOVEMENT': {
			const move = act.getMovePhase();
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

		case 'ACTION': {
			const actionPhase = act.getActionPhase();
			const reactionPhase = actionPhase.getReaction();

			switch (actionPhase.getState()) {
				case 'IDLE':
					if (tile.isContained(actionPhase.getArea())) {
						type = 'actionRange';
					}
					if (tile.isContained(actionPhase.getTargetable())) {
						type = 'actionTargetable';
					}
					break;

				case 'SELECTED': {
					const tgt = actionPhase.getEffectTarget();

					if (tile.isContained(actionPhase.getEffectArea())) {
						type = 'actionEffectArea';
					}
					if (tile.isContained(actionPhase.getEffectTargets().map(char => char.position))) {
						type = 'actionEffectTargets';
					}
					if (tile === tgt) {
						type = 'actionEffectTarget';
					}
					break;
				}

				case 'REACTION':
					if (null !== reactionPhase) {
						const reactor = reactionPhase.getReactor();
						const reactors = actionPhase.getReactions().map(char => char.getReactor().position);

						if (tile.isContained(reactors)) {
							type = 'reactors';
						}
						if (tile.isContained(reactionPhase.getEvasionTargets())) {
							type = 'reactionEvasible';
						}
						if (tile === reactor.position) {
							type = 'reactor';
						}
					}
					break;
			}
			break;
		}

		case 'DIRECTION': {
			const direct = act.getDirectPhase();
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

	const onClick = (tile: Tile) => () => onSelect(tile);

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
