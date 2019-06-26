import React from 'react';

import Act from 'modules/battle/act';
import Character from 'modules/character';
import CharacterAction from 'modules/battle/character-action';

import Actions from 'ui/battle/Actions';

interface IActUIProps {
	act: Act | null;
	onActionSelect: (action: CharacterAction) => void;
}

const ActUI: React.SFC<IActUIProps> = ({ act, onActionSelect }) => {
	if (null === act) {
		return <div>Waiting for act data...</div>;
	}
	const actor = act.actor;
	const actionPhase = act.phases.ACTION;
	const reaction = actionPhase.getReaction();
	const actions = act.getActions();
	const actingChar = act.getActingCharacter();
	const actionCharacters: Character[] = [actor];

	if (reaction) {
		actionCharacters.push(reaction.reactor);
	}

	return (
		<React.Fragment>
			<h3 className="Heading">
				Actions ({actingChar.name})
			</h3>

			{!actingChar.isAI() && (
				<Actions actions={actions} onSelect={onActionSelect} />
			)}
		</React.Fragment>
	);
};

export default ActUI;
