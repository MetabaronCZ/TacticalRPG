import React from 'react';

import ActMove from 'engine/act/movement';
import { formatPositions, formatPosition } from 'components/Game/components/Debug/utils';

interface IActMoveUIProps {
	move: ActMove;
}

const ActMoveUI: React.SFC<IActMoveUIProps> = ({ move }) => (
	<div>
		<h4>Movement phase:</h4>
		<div>State: <strong>{move.getState()}</strong></div>
		<div>Movable: {formatPositions(move.getMovable())}</div>
		<div>Initial position: {formatPosition(move.getInitialPosition())}</div>
		<div>Selected: {formatPosition(move.getTarget())}</div>
		<div>Path: {formatPositions(move.getPath())}</div>
	</div>
);

export default ActMoveUI;
