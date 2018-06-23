import React from 'react';

import { blockSize } from 'data/game-config';
import { PlayerType } from 'modules/player/types';
import { ICharacter } from 'modules/character/types';

interface ICharacterBlockProps {
	readonly char: ICharacter;
	readonly isActor: boolean;
}

class CharacterBlock extends React.Component<ICharacterBlockProps, {}> {
	public render() {
		const { char, isActor } = this.props;
		const player = this.props.char.player;
		const type = (PlayerType.ENEMY === player ? 'enemy' : 'ally');
		const direction = 'looking-' + char.direction.toLowerCase();

		const style: React.CSSProperties = {
			width: blockSize + 'px',
			height: blockSize + 'px'
		};

		return (
			<div className={`Character Character--${type} Character--${direction} ${isActor ? 'is-actor' : ''}`} style={style}>
				<span className="Character-title">
					{char.data.name}
				</span>
			</div>
		);
	}
}

export default CharacterBlock;
