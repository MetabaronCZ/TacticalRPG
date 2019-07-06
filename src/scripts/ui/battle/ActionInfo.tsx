import React from 'react';
import CharacterAction, { formatCost } from 'modules/battle/character-action';

interface IProps {
	action: CharacterAction;
}

const ActionInfo: React.SFC<IProps> = ({ action }) => (
	<div className="ActionInfo">
		<p><strong>Action selected:</strong></p>

		<div className="ActionInfo-body">
			<div className="ActionInfo-body-title">
				{action.title}
			</div>

			<div className="ActionInfo-body-cost">
				{formatCost(action.cost)}
			</div>
		</div>
	</div>
);

export default ActionInfo;
