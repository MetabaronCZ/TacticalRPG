import React from 'react';

import Act from 'modules/battle/act';
import CharacterAction from 'modules/battle/character-action';

import { formatPosition } from 'ui/utils';

import Actions from 'ui/battle/Actions';
import ActMoveUI from 'ui/battle/PhaseMove';
import ActActionUI from 'ui/battle/PhaseAction';
import ActDirectUI from 'ui/battle/PhaseDirect';

interface IActUIProps {
	act: Act|null;
	onActionSelect: (action: CharacterAction) => void;
}

const ActUI: React.SFC<IActUIProps> = ({ act, onActionSelect }) => {
	if (null === act) {
		return <div>Waiting for act data...</div>;
	}
	const move = act.getMovePhase();
	const actionPhase = act.getActionPhase();
	const directPhase = act.getDirectPhase();
	const actions = act.getActions();
	const actor = act.getActor();

	return (
		<table style={{ width: '100%', }}>
			<tbody>
				<tr>
					<td style={{ verticalAlign: 'top', width: '70%', paddingRight: '40px', }}>
						<h3 className="Heading">Character act</h3>
						<div>Phase: <strong>{act.getPhase()}</strong></div>
						<div>Actor: <strong>{actor.name}</strong> {formatPosition(actor.position)}</div>

						<br/>

						<table style={{ width: '100%', }}>
							<tbody>
								<tr>
									<td style={{ verticalAlign: 'top', width: '50%', paddingRight: '20px', }}>
										<ActMoveUI move={move} />
										<br/>
										<ActDirectUI direct={directPhase} />
									</td>

									<td style={{ verticalAlign: 'top', width: '50%', paddingRight: '20px', }}>
										<ActActionUI act={actionPhase} />
									</td>
								</tr>
							</tbody>
						</table>
					</td>

					<td style={{ verticalAlign: 'top', }}>
						<h3 className="Heading">Character Actions</h3>
						<Actions actions={actions} onSelect={onActionSelect} />
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default ActUI;
