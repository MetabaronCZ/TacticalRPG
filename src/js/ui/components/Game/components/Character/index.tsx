import React from 'react';

import { PlayerType } from 'models/player';
import { ICharacter } from 'models/character';
import { Game, IOnCharacterSelect } from 'models/game';

const { blockSize } = Game;

interface ICharacterBlockProps {
	char: ICharacter;
	onSelect: IOnCharacterSelect;
}

const selectCharacter = (char: ICharacter, onSelect: IOnCharacterSelect) => () => onSelect(char);

class CharacterBlock extends React.Component<ICharacterBlockProps, {}> {
	constructor(props: ICharacterBlockProps) {
		super(props);
	}

	public render() {
		const { char, onSelect } = this.props;
		const player = this.props.char.player;
		const type = (PlayerType.ENEMY === player ? 'enemy' : 'ally');

		const style: React.CSSProperties = {
			width: blockSize + 'px',
			height: blockSize + 'px'
		};

		return (
			<div className={`Character Character--${type}`} style={style} onClick={selectCharacter(char, onSelect)}>
				<span className="Character-title">
					{char.data.name}
				</span>
			</div>
		);
	}
}

export default CharacterBlock;
