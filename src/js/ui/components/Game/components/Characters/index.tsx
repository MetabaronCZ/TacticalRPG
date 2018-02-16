import React from 'react';

import CharacterBlock from 'ui/components/Game/components/Character';
import { ICharacter } from 'models/character';

interface ICharacters {
	characters: ICharacter[];
	size: number;
	blockSize: number;
}

export type IOnSelect = () => void;

const renderCharacter = (char: ICharacter, blockSize: number, i: number) => {
	const style: React.CSSProperties = {
		top: (char.position.y * blockSize) + 'px',
		left: (char.position.x * blockSize) + 'px'
	};

	return (
		<div className="Characters-item" style={style} key={i}>
			<CharacterBlock char={char} size={blockSize} />
		</div>
	);
};

const Characters: React.SFC<ICharacters> = ({ characters, size, blockSize }) => (
	<div className="Characters">
		{characters.map((char, i) => {
			return renderCharacter(char, blockSize, i);
		})}
	</div>
);

export default Characters;
