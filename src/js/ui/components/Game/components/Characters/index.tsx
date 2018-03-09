import React from 'react';

import { ICharacter } from 'models/character';
import CharacterBlock from 'ui/components/Game/components/Character';
import { IOnCharacterSelect, blockSize } from 'ui/components/Game';

interface ICharacters {
	characters: ICharacter[];
	onSelect: IOnCharacterSelect;
}

const renderCharacter = (char: ICharacter, i: number, onSelect: IOnCharacterSelect) => {
	const style: React.CSSProperties = {
		top: (char.position.y * blockSize) + 'px',
		left: (char.position.x * blockSize) + 'px'
	};

	return (
		<div className="Characters-item" style={style} key={i}>
			<CharacterBlock char={char} onSelect={onSelect} />
		</div>
	);
};

const Characters: React.SFC<ICharacters> = ({ characters, onSelect }) => (
	<div className="Characters">
		{characters.map((char, i) => renderCharacter(char, i , onSelect))}
	</div>
);

export default Characters;
