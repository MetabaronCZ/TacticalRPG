import React from 'react';

import Act from 'modules/battle/act';
import CharacterAction from 'modules/battle/character-action';

import { formatPosition } from 'ui/utils';

import Actions from 'ui/battle/Actions';
import ActMoveUI from 'ui/battle/PhaseMove';
import ActActionUI from 'ui/battle/PhaseAction';
import ActDirectUI from 'ui/battle/PhaseDirect';
import Player from 'modules/battle/player';

interface IActUIProps {
	act: Act|null;
	players: Player[];
	onActionSelect: (action: CharacterAction) => void;
}

const ActUI: React.SFC<IActUIProps> = ({ act, players, onActionSelect }) => {
	if (null === act) {
		return <div>Waiting for act data...</div>;
	}
	const movePhase = act.getMovePhase();
	const actionPhase = act.getActionPhase();
	const directPhase = act.getDirectPhase();
	const actions = act.getActions();
	const actor = act.getActor();

	const status = actor.status.get().map(st => `${st.id} (${st.duration})`);
	const cooldown = Object.keys(actor.cooldowns);

	const reaction = actionPhase.getReaction();
	const isReaction = ('ACTION' === act.getPhase() && reaction && 'DONE' !== reaction.getState());
	const actingChar = (isReaction && reaction ? reaction.getReactor() : actor);

	return (
		<table className="Act">
			<tbody>
				<tr>
					<td className="Act-row Act-row--character">
						<h3 className="Heading">Character act</h3>
						<div>Phase: <strong>{act.getPhase()}</strong></div>
						<div>Actor: <strong>{actor.name}</strong> {formatPosition(actor.position)}</div>
						<div>Status: [ {status.join(', ')} ]</div>
						<div>Cooldown: [ {cooldown.join(', ')} ]</div>

						<br />

						<table className="Act-phases">
							<tbody>
								<tr>
									<td className="Act-phases-row">
										<ActMoveUI move={movePhase} />
										<ActDirectUI direct={directPhase} />
									</td>

									<td className="Act-phases-row">
										<ActActionUI act={actionPhase} />
									</td>
								</tr>
							</tbody>
						</table>
					</td>

					<td className="Act-row Act-row--actions">
						<h3 className="Heading">Character Actions</h3>

						<div><strong>{actingChar.name}</strong> ({players[actingChar.player].name})</div>
						<div>HP: {actingChar.attributes.HP} / <span className="u-disabled">{actingChar.baseAttributes.HP}</span></div>
						<div>AP: {actingChar.attributes.AP} / <span className="u-disabled">{actingChar.baseAttributes.AP}</span></div>
						<div>Status: [ {actingChar.status.get().map(s => s.effect).join(', ')} ]</div>

						<br />

						<Actions actions={actions} onSelect={onActionSelect} />
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default ActUI;
