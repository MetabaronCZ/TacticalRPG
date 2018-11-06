import React from 'react';

import ActMove from 'modules/battle/act/movement';
import { formatPosition } from 'ui/utils';

interface IActMoveUIProps {
	move: ActMove;
}

const ActMoveUI: React.SFC<IActMoveUIProps> = ({ move }) => (
	<div className="Phase">
		<h4>Movement phase:</h4>
		<div>State: <strong>{move.getState()}</strong></div>
		<div>Movable: {move.getMovable().length} tile/s</div>
		<div>Initial position: {formatPosition(move.getInitialPosition())}</div>
		<div>Selected: {formatPosition(move.getTarget())}</div>
		<div>Path: {move.getPath().length} tile/s</div>
	</div>
);

export default ActMoveUI;
