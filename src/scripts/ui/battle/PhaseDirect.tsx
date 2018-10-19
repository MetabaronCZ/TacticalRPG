import React from 'react';

import ActDirect from 'modules/battle/act/direction';
import { formatPosition, formatPositions } from 'ui/utils';

interface IActDirectUIProps {
	direct: ActDirect;
}

const ActDirectUI: React.SFC<IActDirectUIProps> = ({ direct }) => (
	<div>
		<h4>Direction phase:</h4>
		<div>State: <strong>{direct.getState()}</strong></div>
		<div>Directable: {formatPositions(direct.getDirectable())}</div>
		<div>Target: {formatPosition(direct.getTarget())}</div>
	</div>
);

export default ActDirectUI;
