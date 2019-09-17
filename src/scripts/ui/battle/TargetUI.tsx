import React from 'react';

import Command from 'modules/battle/command';
import { ITargetCombatPreview } from 'modules/battle/combat';

import Commands from 'ui/battle/Commands';
import TargetInfo from 'ui/battle/TargetInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	readonly preview: ITargetCombatPreview;
	readonly commands: Command[];
	readonly info: string;
	readonly onCommandSelect: (command: Command) => void;
}

const TargetUI: React.SFC<IProps> = ({ preview, commands, info, onCommandSelect }) => {
	const { character } = preview;
	const player = character.player.id;
	return (
		<div className="CharacterBox">
			<div className={`CharacterBox-player CharacterBox-player--player${player}`} />
	
			<CharacterInfo character={character} />
			<hr className="Separator" />
	
			<TargetInfo preview={preview} />
			<hr className="Separator" />
	
			{!!info && (
				<p className="Paragraph">{info}</p>
			)}
	
			{commands.length > 0 && (
				<Commands commands={commands} onSelect={onCommandSelect} />
			)}
		</div>
	);
};

export default TargetUI;
