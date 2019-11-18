import React from 'react';

interface IProps {
	readonly label: string;
	readonly small?: boolean;
}

const CombatInfo: React.SFC<IProps> = ({ label, small = true, children }) => (
	<div className="CombatInfo">
		<div className="CombatInfo-label">
			{label}
		</div>

		<div className={`CombatInfo-value u-text-${small ? 'small' : 'default'}`}>
			{children}
		</div>
	</div>
);

export default CombatInfo;
