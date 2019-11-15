import React from 'react';

import StatusEffects from 'data/status-effects';
import { StatusEffectID } from 'modules/battle/status-effect';

interface IProps {
	readonly status: StatusEffectID;
	readonly title?: string;
	readonly minimal?: boolean;
}

const StatusIco: React.SFC<IProps> = ({ status, title, minimal }) => (
	<span
		className={`Ico Ico--${status} Ico--${minimal ? 'minimal' : 'default'}`}
		title={title || StatusEffects.get(status).title}
	/>
);

export default StatusIco;
