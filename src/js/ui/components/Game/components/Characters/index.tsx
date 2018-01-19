import React from 'react';

import Character from 'engine/character';
import CharacterBlock from 'ui/components/Game/components/Character';

interface ICharacters {
	ally: Character[];
	enemy: Character[];
	size: number;
	blockSize: number;
}

export type IOnSelect = () => void;

const renderCharacter = (char: Character, blockSize: number, onSelect: IOnSelect, i: number): JSX.Element => {
	const style = {
		top: (char.getPosition().getY() * blockSize) + 'px',
		left: (char.getPosition().getX() * blockSize) + 'px'
	};

	return (
		<div className="Characters-item" style={style} key={i}>
			<CharacterBlock char={char} size={blockSize} onSelect={onSelect} />
		</div>
	);
};

const Characters = ({ ally, enemy, size, blockSize }: ICharacters): JSX.Element => {
	const characters: Character[] = ally.concat(enemy);

	const onSelect = (char: Character) => (): void => {
		characters.forEach((ch: Character) => {
			ch.select(false);
		});

		char.select(true);
	};

	return (
		<div className="Characters">
			{characters.map((char: Character, i: number) => {
				return renderCharacter(char, blockSize, onSelect(char), i);
			})}
		</div>
	);
};

export default Characters;
