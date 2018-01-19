import React from 'react';

interface IGridProps {
	size: number;
	blockSize: number;
}

const Grid = ({ size, blockSize }: IGridProps): JSX.Element => {
	const itemStyle = {
		width: `${blockSize}px`,
		height: `${blockSize}px`
	};

	return (
		<div className="Grid">
			{Array(size * size).fill(0).map((item: 0, i) => (
				<div className="Grid-item" key={i} style={itemStyle}>
					<div className="Grid-item-block" />
				</div>
			))}
		</div>
	);
};

export default Grid;
