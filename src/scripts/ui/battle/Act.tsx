import React from 'react';

import Act from 'modules/battle/act';
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
	const actingChar = act.getActingCharacter();
	const actions = act.getActions();

	if (!actingChar) {
		return <React.Fragment />;
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
