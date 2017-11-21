import React from 'react';

const renderItem = (type, value, max) => {
	let pct = 100*value/max;

	return (
		<div className={`Bar-item Bar-item--${type}`}>
			<div className="Bar-item-loss" style={{ width: pct + '%' }}></div>
			<div className="Bar-item-value" style={{ width: pct + '%' }}></div>
	
			<div className="Bar-item-text">
				{value} / {max}
			</div>
		</div>
	);
};

const Bar = ({ hp, hpMax, ap, apMax }) => (
	<div className="Bar">
		{renderItem('HP', hp, hpMax)}
		{renderItem('AP', ap, apMax)}
	</div>
);

export default Bar;
