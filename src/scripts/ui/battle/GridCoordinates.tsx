import React, { CSSProperties } from 'react';
import { letters } from 'core/string';
import { gridSize } from 'data/game-config';

const itemPool = Array(gridSize).fill(null);
const itemSize = 100 / gridSize;

const renderItems = (type: 'inRow'| 'inColumn') => {
	const width = ('inRow' === type ? itemSize + '%' : 'auto');
	const height = ('inColumn' === type ? itemSize + '%' : 'auto');

	const style: CSSProperties = {
		width,
		height,
	};

	return itemPool.map((_, i) => (
		<div className={`GridCoordinates-item GridCoordinates-item--${type}`} style={style} key={i}>
			{'inRow' === type ? i + 1 : letters[i]}
		</div>
	));
};

const GridCoordinates: React.SFC<{}> = ({ children }) => {
	return (
		<div className="GridCoordinates">
			<div className="GridCoordinates-row">
				<div className="GridCoordinates-row-column" />

				<div className="GridCoordinates-row-column">
					{renderItems('inRow')}
				</div>

				<div className="GridCoordinates-row-column" />
			</div>

			<div className="GridCoordinates-row">
				<div className="GridCoordinates-row-column">
					{renderItems('inColumn')}
				</div>

				<div className="GridCoordinates-row-column">
					{children}
				</div>

				<div className="GridCoordinates-row-column">
					{renderItems('inColumn')}
				</div>
			</div>

			<div className="GridCoordinates-row">
				<div className="GridCoordinates-row-column" />

				<div className="GridCoordinates-row-column">
					{renderItems('inRow')}
				</div>

				<div className="GridCoordinates-row-column" />
			</div>
		</div>
	);
};

export default GridCoordinates;
