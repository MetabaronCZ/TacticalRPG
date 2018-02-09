import React from 'react';

const renderItem = (type: string, value: number, max: number) => {
	const pct = 100 * value / max;

	return (
		<div className={`Bar-item Bar-item--${type}`}>
			<div className="Bar-item-loss" style={{ width: pct + '%' }} />
			<div className="Bar-item-value" style={{ width: pct + '%' }} />

			<div className="Bar-item-text">
				{value} / {max}
			</div>
		</div>
	);
};

interface IBarProps {
	hp: number;
	hpMax: number;
	ap: number;
	apMax: number;
}

const Bar: React.SFC<IBarProps> = ({ hp, hpMax, ap, apMax }) => (
	<div className="Bar">
		{renderItem('HP', hp, hpMax)}
		{renderItem('AP', ap, apMax)}
	</div>
);

export default Bar;
