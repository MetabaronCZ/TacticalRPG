import React from 'react';

import Command from 'modules/battle/command';
import { ICharacterSnapshot } from 'modules/character';

import Commands from 'ui/battle/Commands';
import TargetInfo from 'ui/battle/TargetInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	readonly character: ICharacterSnapshot;
	readonly commands: Command[];
	readonly info: string;
	readonly onCommandSelect: (command: Command) => void;
}

const TargetUI: React.SFC<IProps> = ({ character, commands, info, onCommandSelect }) => (
	<div className="CharacterBox">
		<div className={`CharacterBox-player CharacterBox-player--player${character.player.id}`} />

		<CharacterInfo character={character} />
		<hr className="Separator" />

		<TargetInfo character={character} />
		<hr className="Separator" />

		{!!info && (
			<p className="Paragraph">{info}</p>
		)}

		{commands.length > 0 && (
			<Commands commands={commands} onSelect={onCommandSelect} />
		)}
	</div>
);

export default TargetUI;
