import React from 'react';

import { gridSize } from 'data/game-config';

import Act from 'engine/battle/act';
import Position from 'engine/battle/position';
import { getPositions } from 'engine/battle/positions';

const itemSize = 100 / gridSize;

interface IGridBaseProps {
	act: Act|null;
	onSelect: (pos: Position) => void;
}

const getColor = (pos: Position, act: Act|null) => {
	let color = 'black';

	if (null === act) {
		return color;
	}
	switch (act.getPhase()) {
		case 'MOVEMENT': {
			const move = act.getMovePhase();
			const tgt = move.getTarget();

			if (pos.isContained(move.getMovable())) {
				color = 'green';
			}
			if (pos.isContained(move.getPath())) {
				color = 'blue';
			}
			if (pos === tgt) {
				color = 'yellow';
			}
			break;
		}

		case 'ACTION': {
			const actionPhase = act.getActionPhase();
			const reactionPhase = actionPhase.getReaction();

			switch (actionPhase.getState()) {
				case 'IDLE':
					if (pos.isContained(actionPhase.getArea())) {
						color = 'green';
					}
					if (pos.isContained(actionPhase.getTargetable())) {
						color = 'blue';
					}
					break;

				case 'SELECTED': {
					const tgt = actionPhase.getEffectTarget();

					if (pos.isContained(actionPhase.getEffectArea())) {
						color = 'green';
					}
					if (pos.isContained(actionPhase.getEffectTargets().map(char => char.position))) {
						color = 'blue';
					}
					if (pos === tgt) {
						color = 'yellow';
					}
					break;
				}

				case 'REACTION':
					if (null !== reactionPhase) {
						const reactor = reactionPhase.getReactor();
						const reactors = actionPhase.getReactions().map(char => char.getReactor().position);

						if (pos.isContained(reactors)) {
							color = 'blue';
						}
						if (pos.isContained(reactionPhase.getEvasionTargets())) {
							color = 'green';
						}
						if (pos === reactor.position) {
							color = 'yellow';
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
				color = 'green';
			}
			if (pos === tgt) {
				color = 'yellow';
			}
			break;
		}
	}

	return color;
};

const GridBase: React.SFC<IGridBaseProps> = ({ act, onSelect }) => {
	const tiles = getPositions().map(pos => {
		return [pos, getColor(pos, act)] as [Position, string];
	});

	return (
		<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', }}>
			{tiles.map(([pos, color], i) => {
				const { x, y } = pos;
				const onClick = () => onSelect(pos);

				return (
					<div
						style={
							{
								position: 'absolute',
								top: y * itemSize + '%',
								left: x * itemSize + '%',
								width: itemSize + '%',
								height: itemSize + '%',
								border: '1px solid grey',
								background: color,
								boxSizing: 'border-box',
							}
						}
						onClick={onClick}
						key={i}
					/>
				);
			})}
		</div>
	);
};

export default GridBase;
