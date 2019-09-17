import React from 'react';

import Command from 'modules/battle/command';
import { IActSnapshot } from 'modules/battle/act';
import { ICasterCombatPreview } from 'modules/battle/combat';

import Commands from 'ui/battle/Commands';
import CommandInfo from 'ui/battle/CommandInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	readonly act: IActSnapshot;
	readonly preview: ICasterCombatPreview | null;
	readonly onCommandSelect: (command: Command) => void;
}

const ActorUI: React.SFC<IProps> = ({ act, preview, onCommandSelect }) => {
	const { actor, phase, phases } = act;
	const { command } = phases.COMMAND;
	const { reactions } = phases.REACTION;
	let { commands, info } = act;

	if ('REACTION' === phase) {
		info = '';
		commands = [];
	}
	return (
		<div className="CharacterBox">
			<div className={`CharacterBox-player CharacterBox-player--player${actor.player.id}`} />

			<CharacterInfo character={actor} />
			<hr className="Separator" />

			{!!command && (
				<React.Fragment>
					<CommandInfo preview={preview} command={command} />
					<hr className="Separator" />
				</React.Fragment>
			)}

			{reactions.length > 0 && (
				<React.Fragment>
					<div>
						<strong>Targets:</strong>
						<br />
						{reactions.map(tgt => {
							const { reactor, command: reactionCommand } = tgt;
							let txt = '...';

							if (reactionCommand) {
								txt = reactionCommand.title;
							}
							return (
								<div key={reactor.id}>
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

			{!actor.isAI && (
				<Commands commands={commands} onSelect={onCommandSelect} />
			)}
		</div>
	);
};

export default ActorUI;
