import React from 'react';

import { ICommandSnapshot } from 'modules/battle/command';
import { ITargetCombatPreview } from 'modules/battle/combat';

import Ico from 'ui/common/Ico';
import Commands from 'ui/battle/Commands';
import TargetInfo from 'ui/battle/TargetInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	readonly preview: ITargetCombatPreview;
	readonly commands: ICommandSnapshot[];
	readonly info: string;
	readonly onCommandSelect: (commandID: string) => void;
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
				<p className="Paragraph">
					<Ico name="info" />
					{info}
				</p>
			)}
	
			{commands.length > 0 && (
				<Commands commands={commands} onSelect={onCommandSelect} />
			)}
		</div>
	);
};

export default TargetUI;
