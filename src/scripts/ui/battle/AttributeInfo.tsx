import React from 'react';
import Bar, { BarColor } from 'ui/battle/Bar';

interface IProps {
	label: string;
	value: number;
	max: number;
	color?: BarColor;
	disabled?: boolean;
}

const AttributeInfo: React.SFC<IProps> = ({ label, color, value, max, disabled }) => {
	return (
		<div className="AttributeInfo">
			<div className="AttributeInfo-label">
				{label}:
			</div>

			<div className="AttributeInfo-bar">
				<Bar color={color} value={value / max} disabled={disabled} />
			</div>

			<div className="AttributeInfo-value">
				{max > 0
					? `${value} / ${max}`
					: <span className="u-disabled">N/A</span>
				}
			</div>
		</div>
	);
};

export default AttributeInfo;
