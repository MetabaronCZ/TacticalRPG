import React from 'react';

import { letters } from 'core/string';
import { gridSize } from 'data/game-config';

const itemPool = Array(gridSize).fill(null);

const renderLetters = () => (
	<div className="GridCoordinates-letters">
		{itemPool.map((_, i) => (
			<div className="GridCoordinates-letters-item" key={letters[i]}>
				{letters[i]}
			</div>
		))}
	</div>
);

const renderNumbers = () => (
	<div className="GridCoordinates-numbers">
		{itemPool.map((_, i) => (
			<div className="GridCoordinates-numbers-item" key={i}>
				{i + 1}
			</div>
		))}
	</div>
);

const GridCoordinates: React.SFC<{}> = ({ children }) => {
	return (
		<div className="GridCoordinates">
			<div className="GridCoordinates-row">
				<div className="GridCoordinates-row-column" />

				<div className="GridCoordinates-row-column">
					{renderLetters()}
				</div>

				<div className="GridCoordinates-row-column" />
			</div>

			<div className="GridCoordinates-row">
				<div className="GridCoordinates-row-column">
					{renderNumbers()}
				</div>

				<div className="GridCoordinates-row-column">
					{children}
				</div>

				<div className="GridCoordinates-row-column">
					{renderNumbers()}
				</div>
			</div>

			<div className="GridCoordinates-row">
				<div className="GridCoordinates-row-column" />

				<div className="GridCoordinates-row-column">
					{renderLetters()}
				</div>

				<div className="GridCoordinates-row-column" />
			</div>
		</div>
	);
};

export default GridCoordinates;
