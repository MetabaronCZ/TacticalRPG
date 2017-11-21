import React from 'react';

const makeGrid = size => {
	let grid = [];

	for ( let x = 0; x < size; x++ ){
		for ( let y = 0; y < size; y++ ){
			grid.push({ x, y });
		}
	}
	return grid;
};

const renderItem = ({ x, y }, i, blockSize) => {
	let blockStyle = {
		top: (x*blockSize + 'px'),
		left: (y*blockSize + 'px'),
		width: (blockSize + 'px'),
		height: (blockSize + 'px')
	};

	return (
		<div className="Grid-item" style={blockStyle} key={i}>
			<div className="Grid-item-block"></div>
		</div>
	);
};

const Grid = ({ size, blockSize }) => {
	let grid = makeGrid(size);

	const gridStyle = {
		width: (size*blockSize + 'px'),
		height: (size*blockSize + 'px')
	};

	return (
		<div className="Grid" style={gridStyle}>
			{grid.map((item, i) => renderItem(item, i, blockSize))}
		</div>
	);
};

export default Grid;
