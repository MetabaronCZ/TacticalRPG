import React from 'react';

import { PlayerType } from 'models/player';
import { ICharacter } from 'models/character';

interface ICharacterBlockProps {
	char: ICharacter;
	size: number;
}

class CharacterBlock extends React.Component<ICharacterBlockProps, {}> {
	constructor(props: ICharacterBlockProps) {
		super(props);
	}

	public render() {
		const { char, size } = this.props;
		const player = this.props.char.player;
		const type = (PlayerType.ENEMY === player ? 'enemy' : 'ally');

		const style: React.CSSProperties = {
			width: size + 'px',
			height: size + 'px'
		};

		return (
			<div className={`Character Character--${type}`} style={style}>
				<span className="Character-title">
					{char.data.name}
				</span>
			</div>
		);
	}
}

export default CharacterBlock;
