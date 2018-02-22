import React from 'react';

import CharacterBlock from 'ui/components/Game/components/Character';
import { ICharacter } from 'models/character';
import { Game } from 'models/game';

const { blockSize } = Game;

interface ICharacters {
	characters: ICharacter[];
}

const renderCharacter = (char: ICharacter, i: number) => {
	const style: React.CSSProperties = {
		top: (char.position.y * blockSize) + 'px',
		left: (char.position.x * blockSize) + 'px'
	};

	return (
		<div className="Characters-item" style={style} key={i}>
			<CharacterBlock char={char} />
		</div>
	);
};

const Characters: React.SFC<ICharacters> = ({ characters }) => (
	<div className="Characters">
		{characters.map(renderCharacter)}
	</div>
);

export default Characters;
