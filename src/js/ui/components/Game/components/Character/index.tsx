import React from 'react';
import { Character } from 'models/character';

interface ICharacterBlockProps {
	char: Character;
	size: number;
}

class CharacterBlock extends React.Component<ICharacterBlockProps, {}> {
	constructor(props: ICharacterBlockProps) {
		super(props);
	}

	public render() {
		const { char, size } = this.props;
		const player = this.props.char.getPlayer();
		const type = (player.isEnemy() ? 'enemy' : 'ally');

		const style: React.CSSProperties = {
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
