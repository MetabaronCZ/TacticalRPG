import React from 'react';

import Character from 'engine/character';
import Player from 'engine/player';

interface ICharacterBlockProps {
	char: Character;
	size: number;
}

class CharacterBlock extends React.Component {
	public props: ICharacterBlockProps;

	constructor(props: ICharacterBlockProps) {
		super(props);
	}

	public render() {
		const { char, size } = this.props;
		const player = this.props.char.getPlayer();
		const type = (player.isEnemy() ? 'enemy' : 'ally');

		const style = {
			width: size + 'px',
			height: size + 'px'
		};

		return (
			<div className={`Character Character--${type}`} style={style}>
				<span className="Character-title">
					{char.name}
				</span>
			</div>
		);
	}
}

export default CharacterBlock;
