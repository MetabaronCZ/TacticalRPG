import React from 'react';

import ActReaction from 'modules/battle/act/reaction';
import { formatTile, formatTiles } from 'ui/utils';

interface IActReactUIProps {
	isActive: boolean;
	reaction: ActReaction;
}

const ActReactUI: React.SFC<IActReactUIProps> = ({ reaction, isActive }) => {
	const reactor = reaction.getReactor();
	const action = reaction.getAction();

	return (
		<div className={`Phase ${isActive ? 'is-active' : ''}`}>
			<h4>Reactor: {reactor.name}</h4>
			<div>State: {reaction.getState()}</div>
			<div>Status: [ {reactor.status.get().map(s => s.effect).join(', ')} ]</div>
			<div>Action: {action ? `${action.title} (${action.skills.join(', ')})` : '-'}</div>
			<div>Evasible: {formatTiles(reaction.getEvasionTargets())}</div>
			<div>Evasion target: {formatTile(reaction.getEvasionTarget())}</div>
		</div>
	);
};

export default ActReactUI;
