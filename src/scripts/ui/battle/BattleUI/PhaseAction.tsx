import React from 'react';

import ActAction from 'engine/act/action';
import ActReactUI from 'ui/battle/BattleUI/PhaseReaction';
import { formatPositions, formatPosition } from 'ui/battle/BattleUI/utils';

interface IActActionUIProps {
	act: ActAction;
}

const ActActionUI: React.SFC<IActActionUIProps> = ({ act }) => {
	const action = act.getAction();

	return (
		<div>
			<h4>Action phase:</h4>
			<div>State: <strong>{act.getState()}</strong></div>
			<div>Action: {null !== action ? `${action.getTitle()} (${action.getId()})` : '-'}</div>
			<div>Action range: {formatPositions(act.getArea())}</div>
			<div>Targetable: {formatPositions(act.getTargetable())}</div>
			<div>Selected target: {formatPosition(act.getEffectTarget())}</div>
			<div>Action effect area: {formatPositions(act.getEffectArea())}</div>
			<div>Action effect targets: [ {act.getEffectTargets().map(char => char.name).join(', ')} ]</div>
			<br/>

			{act.getReactions().map((reaction, i) => {
				const isActive = (reaction === act.getReaction());
				return <ActReactUI reaction={reaction} isActive={isActive} key={i} />;
			})}
		</div>
	);
};

export default ActActionUI;
