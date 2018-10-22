import React from 'react';

import ActAction from 'modules/battle/act/action';

import ActReactUI from 'ui/battle/PhaseReaction';
import { formatPosition, formatPositions } from 'ui/utils';

interface IActActionUIProps {
	act: ActAction;
}

const ActActionUI: React.SFC<IActActionUIProps> = ({ act }) => {
	const action = act.getAction();

	return (
		<div className="Phase">
			<h4>Action phase:</h4>
			<div>State: <span className="u-weight-bold">{act.getState()}</span></div>
			<div>Action: {null !== action ? `${action.title} (${action.id})` : '-'}</div>
			<div>Action range: {formatPositions(act.getArea())}</div>
			<div>Targetable: {formatPositions(act.getTargetable())}</div>
			<div>Selected target: {formatPosition(act.getEffectTarget())}</div>
			<div>Action effect area: {formatPositions(act.getEffectArea())}</div>
			<div>Action effect targets: [ {act.getEffectTargets().map(char => char.name).join(', ')} ]</div>

			<br />

			{act.getReactions().map((reaction, i) => {
				const isActive = (reaction === act.getReaction());
				return <ActReactUI reaction={reaction} isActive={isActive} key={i} />;
			})}
		</div>
	);
};

export default ActActionUI;
