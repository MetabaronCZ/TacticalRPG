import React from 'react';

import { blockSize } from 'data/game-config';
import { ICharacter } from 'modules/character';
import CharacterBlock from 'components/Game/components/Character';

interface ICharacters {
	readonly actor?: ICharacter;
	readonly characters: ICharacter[];
}

const renderCharacter = (char: ICharacter, isActor: boolean, i: number) => {
	const style: React.CSSProperties = {
		top: (char.position.y * blockSize) + 'px',
		left: (char.position.x * blockSize) + 'px'
	};

	return (
		<div className="Characters-item" style={style} key={i}>
			<CharacterBlock isActor={isActor} char={char} />
		</div>
	);
};

const Characters: React.SFC<ICharacters> = ({ actor, characters }) => (
	<div className="Characters">
		{characters.map((char, i) => renderCharacter(char, char === actor, i))}
	</div>
);

export default Characters;
