import React from 'react';

import Command from 'modules/battle/command';
import { IActState } from 'modules/battle/act';

import EmptyUI from 'ui/battle/EmptyUI';
import Commands from 'ui/battle/Commands';
import CombatInfo from 'ui/battle/CombatInfo';
import CommandInfo from 'ui/battle/CommandInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	readonly act: IActState;
	readonly onCommandSelect: (command: Command) => void;
}

const ReactorUI: React.SFC<IProps> = ({ act, onCommandSelect }) => {
	const { reaction } = act.phases.REACTION;

	if (!reaction) {
		return <EmptyUI />;
	}
	const { reactor, command, combat } = reaction;
	let { commands, info } = act;

	if (reactor.isAI) {
		info = '';
		commands = [];
	}
	return (
		<div className="CharacterBox">
			<div className={`CharacterBox-player CharacterBox-player--player${reactor.player}`} />

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

			{!reactor.isAI && (
				<Commands commands={commands} onSelect={onCommandSelect} />
			)}
		</div>
	);
};

export default ReactorUI;
