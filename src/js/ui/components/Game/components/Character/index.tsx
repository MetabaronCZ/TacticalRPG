import React from 'react';

import Character from 'engine/character';
import Player from 'engine/player';
import { IOnSelect } from 'ui/components/Game/components/Characters';

interface ICharacterBlockProps {
	char: Character;
	size: number;
	onSelect: IOnSelect;
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

		const onSelect = () => {
			this.props.onSelect();
			this.forceUpdate();
		};

		return (
			<div
				className={`Character Character--${type} ${char.isSelected() ? 'is-selected' : ''}`}
				style={style}
				onClick={onSelect}
			>
				<span className="Character-title">
					{char.name}
				</span>
			</div>
		);
	}
}

export default CharacterBlock;
