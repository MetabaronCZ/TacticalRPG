import React from 'react';

import BarValue from 'ui/battle/BarValue';
import Bar, { BarColor } from 'ui/battle/Bar';

interface IProps {
	readonly label: string;
	readonly value: number;
	readonly max: number;
	readonly color?: BarColor;
	readonly disabled?: boolean;
}

const AttributeInfo: React.SFC<IProps> = ({ label, color, value, max, disabled }) => (
	<div className="AttributeInfo">
		<div className="AttributeInfo-label">
			{label}:
		</div>

		<div className="AttributeInfo-bar">
			<Bar color={color} value={value / max} disabled={disabled} />
		</div>

		<div className="AttributeInfo-value">
			<BarValue value={value} max={max} />
		</div>
	</div>
);

export default AttributeInfo;
