import React from 'react';

export type BarColor = 'green' | 'blue' | 'yellow';

interface IProps {
	value: number;
	color?: BarColor;
	disabled?: boolean;
}

const Bar: React.SFC<IProps> = ({ value, color = 'green', disabled = false }) => {
	if (disabled) {
		return <div className="Bar is-disabled" />;
	}
	const pct = (value * 100).toFixed(2) + '%';

	return (
		<div className={`Bar Bar--${color}`} title={pct}>
			<div className="Bar-decrease" style={{ width: pct }} />
			<div className="Bar-increase" style={{ width: pct }} />
			<div className="Bar-amount" style={{ width: pct }} />
		</div>
	);
};

export default Bar;
