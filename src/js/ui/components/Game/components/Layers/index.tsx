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
			{children.map((layer: JSX.Element) => (
				<div className="Layers-item">
					{layer}
				</div>
			))}
		</div>
	);
};

export default Layers;
