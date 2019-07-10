import React from 'react';

import Act from 'modules/battle/act';
import Command from 'modules/battle/command';

import Commands from 'ui/battle/Commands';
import CommandInfo from 'ui/battle/CommandInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	act: Act | null;
	onCommandSelect: (command: Command) => void;
}

const ActorUI: React.SFC<IProps> = ({ act, onCommandSelect }) => {
	if (!act) {
		return <React.Fragment />;
	}
	const { actor } = act;
	const command = act.phases.COMMAND.getCommand();
	const reactions = act.phases.REACTION.getReactions();

	let commands = act.getCommands();
	let info = act.getInfo();

	if ('REACTION' === act.getPhase()) {
		info = '';
		commands = [];
	}
	return (
		<div className="CharacterBox">
			<CharacterInfo character={actor} />

			<hr className="Separator" />

			{!!command && (
				<React.Fragment>
					<CommandInfo command={command} />
					<hr className="Separator" />
				</React.Fragment>
			)}

			{reactions.length > 0 && (
				<React.Fragment>
					<div>
						<strong>Targets:</strong>
						<br/>
						{reactions.map((tgt, t) => {
							const { reactor, command: reactionCommand } = tgt;
							let txt = '...';

							if (reactionCommand) {
								txt = reactionCommand.title;
							}
							return (
								<div key={t}>
									{reactor.name} ({txt})
								</div>
							);
						})}
					</div>
					<hr className="Separator" />
				</React.Fragment>
			)}

			{!!info && (
				<p className="Paragraph">{info}</p>
			)}

			{!actor.isAI() && (
				<Commands commands={commands} onSelect={onCommandSelect} />
			)}
		</div>
	);
};

export default ActorUI;
