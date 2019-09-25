import React from 'react';

import { IActSnapshot } from 'modules/battle/act';
import { ICasterCombatPreview } from 'modules/battle/combat';

import { formatCombatResult } from 'ui/format';

import Ico from 'ui/common/Ico';
import Commands from 'ui/battle/Commands';
import CommandInfo from 'ui/battle/CommandInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	readonly act: IActSnapshot;
	readonly preview: ICasterCombatPreview | null;
	readonly onCommandSelect: (commandID: string) => void;
}

const ActorUI: React.SFC<IProps> = ({ act, preview, onCommandSelect }) => {
	const { actor, phase, phases } = act;
	const { command } = phases.COMMAND;
	const { reactions } = phases.REACTION;
	const { results } = phases.COMBAT;
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
							let txt: React.ReactNode = '...';

							if (reactionCommand) {
								txt = reactionCommand.title;
							}
							const result = results.find(r => reactor.id === r.character);

							if (result) {
								txt = formatCombatResult(result);
							}
							return (
								<div key={reactor.id}>
									{reactor.name} → {txt}
								</div>
							);
						})}
					</div>
					<hr className="Separator" />
				</React.Fragment>
			)}

			{!!info && (
				<p className="Paragraph">
					<Ico name="info" />
					{info}
				</p>
			)}

			{!actor.isAI && (
				<Commands commands={commands} onSelect={onCommandSelect} />
			)}
		</div>
	);
};

export default ActorUI;
