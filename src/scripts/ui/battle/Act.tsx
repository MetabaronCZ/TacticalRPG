import React from 'react';

import Act from 'modules/battle/act';
import Character from 'modules/character';
import CharacterAction from 'modules/battle/character-action';

import { formatTile } from 'ui/utils';
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
	const movePhase = act.getMovePhase();
	const actionPhase = act.getActionPhase();
	const directPhase = act.getDirectPhase();
	const action = actionPhase.getAction();
	const reaction = actionPhase.getReaction();
	const actions = act.getActions();
	const actor = act.getActor();

	const status = actor.status.get().map(st => `${st.effect} (${st.duration})`);
	const cooldown = Object.keys(actor.cooldowns);
	const actingChar = act.getActingCharacter();
	const actionCharacters: Character[] = [actor];

	if (reaction) {
		actionCharacters.push(reaction.getReactor());
	}

	return (
		<table className="Act">
			<tbody>
				<tr>
					<td className="Act-row Act-row--character">
						<h3 className="Heading">Character act</h3>
						<div>Phase: <strong>{act.getPhase()}</strong></div>
						<div>Actor: <strong>{actor.name}</strong> {formatTile(actor.position)}</div>
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
						<h3 className="Heading">Character Info</h3>

						<div className="ActBattleInfo">
							{actionCharacters.map((char, i) => (
								<React.Fragment key={i}>
									<div className="ActBattleInfo-item">
										<strong>{char.name}</strong> ({char.player.getName()})
										<br />
										HP: {char.attributes.HP} / <span className="u-disabled">{char.baseAttributes.HP}</span>
										<br />
										AP: {char.attributes.AP} / <span className="u-disabled">{char.baseAttributes.AP}</span>
										<br />
										Status: [ {char.status.get().map(s => s.effect).join(', ')} ]
									</div>

									{i < actionCharacters.length - 1 && (
										<div className="ActBattleInfo-item ActBattleInfo-item--delimiter">
											&rsaquo;
										</div>
									)}
								</React.Fragment>
							))}
						</div>

						{!!action && (
							<React.Fragment>
								<div>Action: {action.title}</div>
								<br />
							</React.Fragment>
						)}

						{!actingChar.isAI() && (
							<Actions actions={actions} onSelect={onActionSelect} />
						)}
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default ActUI;
