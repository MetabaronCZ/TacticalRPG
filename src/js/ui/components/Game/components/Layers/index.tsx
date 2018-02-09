import React from 'react';

interface ILayersProps {
	size: number;
	blockSize: number;
}

const Layers: React.SFC<ILayersProps> = ({ size, blockSize, children }) => {
	const style: React.CSSProperties = {
		width: (size * blockSize + 'px'),
		height: (size * blockSize + 'px')
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
