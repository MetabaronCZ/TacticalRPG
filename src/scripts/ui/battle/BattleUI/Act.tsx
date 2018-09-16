import React from 'react';

import Act from 'engine/act';
import CharacterAction from 'engine/character-action';

import Actions from 'ui/battle/BattleUI/Actions';
import ActMoveUI from 'ui/battle/BattleUI/PhaseMove';
import ActActionUI from 'ui/battle/BattleUI/PhaseAction';
import ActDirectUI from 'ui/battle/BattleUI/PhaseDirect';
import { formatPosition } from 'ui/battle/BattleUI/utils';

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
						<div>Actor: <strong>{actor.getData().name}</strong> {formatPosition(actor.getPosition())}</div>

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
