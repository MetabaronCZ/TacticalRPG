import React from 'react';

import { gridSize } from 'data/game-config';

import Act from 'modules/battle/act';
import Position from 'modules/geometry/position';
import { getPositions } from 'modules/geometry/positions';

const itemSize = 100 / gridSize;

interface IGridBaseProps {
	act: Act|null;
	onSelect: (pos: Position) => void;
}

type TileType =
	'default' |
	'movable' | 'movePath' | 'moveTarget' |
	'actionRange' | 'actionTargetable' |
	'actionEffectArea' | 'actionEffectTargets' | 'actionEffectTarget' |
	'reactors' | 'reactionEvasible' | 'reactor' |
	'directable' | 'directTarget';

const getTileType = (pos: Position, act: Act|null): TileType => {
	let type: TileType = 'default';

	if (null === act) {
		return type;
	}
	switch (act.getPhase()) {
		case 'MOVEMENT': {
			const move = act.getMovePhase();
			const tgt = move.getTarget();

			if (pos.isContained(move.getMovable())) {
				type = 'movable';
			}
			if (pos.isContained(move.getPath())) {
				type = 'movePath';
			}
			if (pos === tgt) {
				type = 'moveTarget';
			}
			break;
		}

		case 'ACTION': {
			const actionPhase = act.getActionPhase();
			const reactionPhase = actionPhase.getReaction();

			switch (actionPhase.getState()) {
				case 'IDLE':
					if (pos.isContained(actionPhase.getArea())) {
						type = 'actionRange';
					}
					if (pos.isContained(actionPhase.getTargetable())) {
						type = 'actionTargetable';
					}
					break;

				case 'SELECTED': {
					const tgt = actionPhase.getEffectTarget();

					if (pos.isContained(actionPhase.getEffectArea())) {
						type = 'actionEffectArea';
					}
					if (pos.isContained(actionPhase.getEffectTargets().map(char => char.position))) {
						type = 'actionEffectTargets';
					}
					if (pos === tgt) {
						type = 'actionEffectTarget';
					}
					break;
				}

				case 'REACTION':
					if (null !== reactionPhase) {
						const reactor = reactionPhase.getReactor();
						const reactors = actionPhase.getReactions().map(char => char.getReactor().position);

						if (pos.isContained(reactors)) {
							type = 'reactors';
						}
						if (pos.isContained(reactionPhase.getEvasionTargets())) {
							type = 'reactionEvasible';
						}
						if (pos === reactor.position) {
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

			if (pos.isContained(direct.getDirectable())) {
				type = 'directable';
			}
			if (pos === tgt) {
				type = 'directTarget';
			}
			break;
		}
	}

	return type;
};

const GridBase: React.SFC<IGridBaseProps> = ({ act, onSelect }) => {
	const tiles = getPositions().map(pos => {
		return [pos, getTileType(pos, act)] as [Position, TileType];
	});

	const onClick = (pos: Position) => () => onSelect(pos);

	return (
		<div className="GridTiles">
			{tiles.map(([pos, type], i) => {
				const { x, y } = pos;
				return (
					<div
						className={`GridTiles-item GridTiles-item--${type}`}
						style={
							{
								top: (y * itemSize + '%'),
								left: (x * itemSize + '%'),
								width: (itemSize + '%'),
								height: (itemSize + '%'),
							}
						}
						onClick={onClick(pos)}
						key={i}
					/>
				);
			})}
		</div>
	);
};

export default GridBase;
