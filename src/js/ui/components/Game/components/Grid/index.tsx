import React from 'react';

interface IGridItem {
	x: number;
	y: number;
}
type IGrid = IGridItem[];

const makeGrid = (size: number): IGrid => {
	const grid: IGrid = [];

	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			grid.push({ x, y });
		}
	}
	return grid;
};

const renderItem = ({ x, y }: IGridItem, i: number, blockSize: number): JSX.Element => {
	const blockStyle: any = {
		top: (x * blockSize + 'px'),
		left: (y * blockSize + 'px'),
		width: (blockSize + 'px'),
		height: (blockSize + 'px')
	};

	return (
		<div className="Grid-item" style={blockStyle} key={i}>
			<div className="Grid-item-block" />
		</div>
	);
};

interface IGridProps {
	size: number;
	blockSize: number;
}

const Grid = ({ size, blockSize }: IGridProps): JSX.Element => {
	const grid: IGrid = makeGrid(size);

	const gridStyle: any = {
		width: (size * blockSize + 'px'),
		height: (size * blockSize + 'px')
	};

	return (
		<div className="Grid" style={gridStyle}>
			{grid.map((item: IGridItem, i: number) => renderItem(item, i, blockSize))}
		</div>
	);
};

export default Grid;
