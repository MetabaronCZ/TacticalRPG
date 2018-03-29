import React from 'react';

import { ICharacter } from 'models/character';

import CharacterBlock from 'components/Game/components/Character';
import { IOnCharacterSelect, blockSize } from 'components/Game';

interface ICharacters {
	actor?: ICharacter;
	characters: ICharacter[];
	onSelect: IOnCharacterSelect;
}

const renderCharacter = (char: ICharacter, isActor: boolean, i: number, onSelect: IOnCharacterSelect) => {
	const style: React.CSSProperties = {
		top: (char.position.y * blockSize) + 'px',
		left: (char.position.x * blockSize) + 'px'
	};

	return (
		<div className="Characters-item" style={style} key={i}>
			<CharacterBlock isActor={isActor} char={char} onSelect={onSelect} />
		</div>
	);
};

const Characters: React.SFC<ICharacters> = ({ actor, characters, onSelect }) => (
	<div className="Characters">
		{characters.map((char, i) => renderCharacter(char, char === actor, i, onSelect))}
	</div>
);

export default Characters;
