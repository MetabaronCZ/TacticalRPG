import React from 'react';

import { Game } from 'models/game';
import { ICharacter } from 'models/character';

import { IOnCharacterSelect } from 'components/Game';
import CharacterBlock from 'components/Game/components/Character';

interface ICharacters {
	characters: ICharacter[];
	onSelect: IOnCharacterSelect;
}

const { blockSize } = Game;

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
