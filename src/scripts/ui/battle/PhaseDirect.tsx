import React from 'react';

import ActDirect from 'engine/battle/act/direction';
import { formatPosition, formatPositions } from 'engine/utils/position';

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
