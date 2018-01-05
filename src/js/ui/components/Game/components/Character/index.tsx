import React from 'react';

import Character from 'engine/character';
import Player from 'engine/player';

interface ICharacterBlockProps {
	data: Character;
}

const CharacterBlock = ({ data }: ICharacterBlockProps): JSX.Element => {
	const player: Player = data.getPlayer();

	const style = {
		background: (player.isEnemy() ? 'red' : 'blue')
	};

	return (
		<div className="Character" style={style}>
			{data.name}
		</div>
	);
};

export default CharacterBlock;
