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

const renderCharacter = (char: Character, blockSize: number, i: number): JSX.Element => {
	const style = {
		top: (char.getPosition().y * blockSize) + 'px',
		left: (char.getPosition().x * blockSize) + 'px'
	};

	return (
		<div className="Characters-item" style={style} key={i}>
			<CharacterBlock char={char} size={blockSize} />
		</div>
	);
};

const Characters = ({ ally, enemy, size, blockSize }: ICharacters): JSX.Element => {
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
