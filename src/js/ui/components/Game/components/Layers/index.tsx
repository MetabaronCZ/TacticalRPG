import React from 'react';

interface ILayersProps {
	size: number;
	blockSize: number;
	children?: JSX.Element|JSX.Element[];
}

const Layers = ({ size, blockSize, children }: ILayersProps): JSX.Element => {
	const style: any = {
		width: (size * blockSize + 'px'),
		height: (size * blockSize + 'px')
	};

	if (!children) {
		return <div />;
	}

	if (!(children instanceof Array)) {
		children = [children];
	}

	return (
		<div className="Layers" style={style}>
			{children.map((layer, i) => (
				<div className="Layers-item" key={i}>
					{layer}
				</div>
			))}
		</div>
	);
};

export default Layers;
