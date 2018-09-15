import React from 'react';
import { blockSize, gridSize } from 'data/game-config';

const Layers: React.SFC<{}> = ({ children }) => {
	const style: React.CSSProperties = {
		width: (gridSize * blockSize + 'px'),
		height: (gridSize * blockSize + 'px'),
	};
	return children
		? (
			<div className="Layers" style={style}>
				{React.Children.map(children, (layer, i) => (
					<div className="Layers-item" key={i}>
						{layer}
					</div>
				))}
			</div>
		)
		: null;
};

export default Layers;
