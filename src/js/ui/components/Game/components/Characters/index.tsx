import React from 'react';

import { Character } from 'models/character';
import CharacterBlock from 'ui/components/Game/components/Character';

interface ICharacters {
	ally: Character[];
	enemy: Character[];
	size: number;
	blockSize: number;
}

export type IOnSelect = () => void;

const renderCharacter = (char: Character, blockSize: number, i: number) => {
	const style: React.CSSProperties = {
		top: (char.getPosition().y * blockSize) + 'px',
		left: (char.getPosition().x * blockSize) + 'px'
	};

	return (
		<div className="Characters-item" style={style} key={i}>
			<CharacterBlock char={char} size={blockSize} />
		</div>
	);
};

const Characters: React.SFC<ICharacters> = ({ ally, enemy, size, blockSize }) => {
	const characters = ally.concat(enemy);

	return (
		<div className="Characters">
			{characters.map((char, i) => {
				return renderCharacter(char, blockSize, i);
			})}
		</div>
	);
};

export default Characters;
