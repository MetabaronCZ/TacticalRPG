import React from 'react';

import ActMove from 'modules/battle/act/movement';
import { formatPositions, formatPosition } from 'ui/utils';

interface IActMoveUIProps {
	move: ActMove;
}

const ActMoveUI: React.SFC<IActMoveUIProps> = ({ move }) => (
	<div className="Phase">
		<h4>Movement phase:</h4>
		<div>State: <span className="u-weight-bold">{move.getState()}</span></div>
		<div>Movable: {formatPositions(move.getMovable())}</div>
		<div>Initial position: {formatPosition(move.getInitialPosition())}</div>
		<div>Selected: {formatPosition(move.getTarget())}</div>
		<div>Path: {formatPositions(move.getPath())}</div>
	</div>
);

export default ActMoveUI;
