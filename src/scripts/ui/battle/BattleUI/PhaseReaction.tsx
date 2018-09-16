import React from 'react';

import ActReaction from 'engine/act/reaction';
import { formatPositions, formatPosition } from 'ui/battle/BattleUI/utils';

interface IActReactUIProps {
	isActive: boolean;
	reaction: ActReaction;
}

const ActReactUI: React.SFC<IActReactUIProps> = ({ reaction, isActive }) => {
	const reactor = reaction.getReactor();
	const action = reaction.getAction();

	return (
		<div style={{ backgroundColor: (isActive ? 'black' : ''), marginBottom: '10px', }}>
			<h4>Reactor: {reactor.getData().name}</h4>
			<div>State: {reaction.getState()}</div>
			<div>Action: {action ? `${action.getTitle()} (${action.getSkills().join(', ')})` : '-'}</div>
			<div>Evasible: {formatPositions(reaction.getEvasionTargets())}</div>
			<div>Evasion target: {formatPosition(reaction.getEvasionTarget())}</div>
		</div>
	);
};

export default ActReactUI;
