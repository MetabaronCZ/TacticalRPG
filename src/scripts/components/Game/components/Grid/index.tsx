import React from 'react';

import { IPath } from 'models/pathfinding';
import { Position, IPosition } from 'models/position';
import { blockSize, gridSize, IOnGridSelect } from 'components/Game';

interface IGridProps {
	selected?: IPosition;
	movable?: IPosition[];
	path?: IPath;
	onSelect: IOnGridSelect;
}

const selectBlock = (i: number, onSelect: IOnGridSelect) => () => {
	const pos = Position.create(i % gridSize, Math.floor(i / gridSize));
	onSelect(pos);
};

const Grid: React.SFC<IGridProps> = ({ selected, movable, path, onSelect }) => {
	const itemStyle: React.CSSProperties = {
		width: `${blockSize}px`,
		height: `${blockSize}px`
	};

	const grid: IPosition[] = [];

	// generate grid item coordinates
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			grid.push(Position.create(y, x));
		}
	}

	return (
		<div className="Grid">
			{grid.map((pos, i) => {
				const blockCls: string[] = ['Grid-item-block'];

				if (Position.isEqual(selected, pos)) {
					blockCls.push('is-selected');
				}

				if (Position.isContained(pos, movable)) {
					blockCls.push('is-movable');
				}

				if (Position.isContained(pos, path)) {
					blockCls.push('is-highlighted');
				}

				return (
					<div className="Grid-item" key={i} style={itemStyle}>
						<div className={blockCls.join(' ')} onClick={selectBlock(i, onSelect)} />
					</div>
				);
			})}
		</div>
	);
};

export default Grid;
