import React from 'react';
import { Game } from 'models/game';

const { gridSize, blockSize } = Game;

const Grid: React.SFC = () => {
	const itemStyle: React.CSSProperties = {
		width: `${blockSize}px`,
		height: `${blockSize}px`
	};

	return (
		<div className="Grid">
			{Array(gridSize * gridSize).fill(0).map((item: 0, i) => (
				<div className="Grid-item" key={i} style={itemStyle}>
					<div className="Grid-item-block" />
				</div>
			))}
		</div>
	);
};

export default Grid;
