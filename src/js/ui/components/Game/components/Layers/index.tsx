import React from 'react';
import { Game } from 'models/game';

const { blockSize, gridSize } = Game;

const Layers: React.SFC = ({ children }) => {
	const style: React.CSSProperties = {
		width: (gridSize * blockSize + 'px'),
		height: (gridSize * blockSize + 'px')
	};

	if (!children) {
		return <div />;
	}
	return (
		<div className="Layers" style={style}>
			{React.Children.map(children, (layer, i) => (
				<div className="Layers-item" key={i}>
					{layer}
				</div>
			))}
		</div>
	);
};

export default Layers;
