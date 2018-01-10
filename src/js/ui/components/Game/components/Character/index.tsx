import React from 'react';

import Character from 'engine/character';
import Player from 'engine/player';

interface ICharacterBlockProps {
	data: Character;
	size: number;
}

const CharacterBlock = ({ data, size }: ICharacterBlockProps): JSX.Element => {
	const player: Player = data.getPlayer();
	const type: string = (player.isEnemy() ? 'enemy' : 'ally');

	const style = {
		width: size + 'px',
		height: size + 'px'
	};

	return (
		<div className={`Character Character--${type}`} style={style}>
			<span className="Character-title">
				{data.name}
			</span>
		</div>
	);
};

export default CharacterBlock;
