import React from 'react';

import Act from 'modules/battle/act';
import Command from 'modules/battle/command';

import EmptyUI from 'ui/battle/EmptyUI';
import Commands from 'ui/battle/Commands';
import CombatInfo from 'ui/battle/CombatInfo';
import CommandInfo from 'ui/battle/CommandInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	act: Act;
	onCommandSelect: (command: Command) => void;
}

const ReactorUI: React.SFC<IProps> = ({ act, onCommandSelect }) => {
	const reaction = act.phases.REACTION.getReaction();

	if (!reaction) {
		return <EmptyUI />;
	}
	const { reactor, command, combat } = reaction;
	let commands = act.getCommands();
	let info = act.getInfo();

	if ('REACTION' !== act.getPhase()) {
		info = '';
		commands = [];
	}
	return (
		<div className="CharacterBox">
			<CharacterInfo character={reactor} />
			<hr className="Separator" />

			<CombatInfo combat={combat} />
			<hr className="Separator" />

			{!!command && (
				<React.Fragment>
					<CommandInfo command={command} />
					<hr className="Separator" />
				</React.Fragment>
			)}

			{!!info && (
				<p className="Paragraph">{info}</p>
			)}

			{!reactor.isAI() && (
				<Commands commands={commands} onSelect={onCommandSelect} />
			)}
		</div>
	);
};

export default ReactorUI;
