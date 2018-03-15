import React from 'react';

import { Position } from 'models/position';
import { IOnGridSelect } from 'components/Game';
import { blockSize, gridSize } from 'components/Game';

interface IGridProps {
	onSelect: IOnGridSelect;
}

const selectBlock = (i: number, onSelect: IOnGridSelect) => () => {
	const pos = new Position(i % gridSize, Math.floor(i / gridSize));
	onSelect(pos);
};

const Grid: React.SFC<IGridProps> = ({ onSelect }) => {
	const itemStyle: React.CSSProperties = {
		width: `${blockSize}px`,
		height: `${blockSize}px`
	};

	return (
		<div className="Grid">
			{Array(gridSize * gridSize).fill(0).map((item: 0, i) => (
				<div className="Grid-item" key={i} style={itemStyle}>
					<div className="Grid-item-block" onClick={selectBlock(i, onSelect)} />
				</div>
			))}
		</div>
	);
};

export default Grid;
