import React from 'react';

import ActDirect from 'modules/battle/act/direction';
import { formatTile, formatTiles } from 'ui/utils';

interface IActDirectUIProps {
	direct: ActDirect;
}

const ActDirectUI: React.SFC<IActDirectUIProps> = ({ direct }) => (
	<div className="Phase">
		<h4>Direction phase:</h4>
		<div>State: <strong>{direct.getState()}</strong></div>
		<div>Directable: {formatTiles(direct.getDirectable())}</div>
		<div>Target: {formatTile(direct.getTarget())}</div>
	</div>
);

export default ActDirectUI;
