import React from 'react';

import StatusEffects from 'data/status-effects';
import { StatusEffectID } from 'modules/battle/status-effect';

interface IProps {
	status: StatusEffectID;
	minimal?: boolean;
}

const availableStatusIcos: StatusEffectID[] = ['BURN', 'BLEED', 'DYING', 'REGEN'];

const StatusIco: React.SFC<IProps> = ({ status, minimal }) => {
	if (minimal && !availableStatusIcos.includes(status)) {
		return <React.Fragment />;
	}
	return (
		<span
			className={`Ico Ico--${status} Ico--${minimal ? 'minimal' : 'default'}`}
			title={StatusEffects.get(status).title}
		/>
	);
};

export default StatusIco;
