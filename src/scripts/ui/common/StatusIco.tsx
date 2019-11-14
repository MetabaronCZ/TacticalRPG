import React from 'react';

import StatusEffects from 'data/status-effects';
import { StatusEffectID } from 'modules/battle/status-effect';

interface IProps {
	status: StatusEffectID;
	minimal?: boolean;
}

const StatusIco: React.SFC<IProps> = ({ status, minimal }) => (
	<span
		className={`Ico Ico--${status} Ico--${minimal ? 'minimal' : 'default'}`}
		title={StatusEffects.get(status).title}
	/>
);

export default StatusIco;
