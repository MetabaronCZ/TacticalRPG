import React from 'react';

import { gridSize } from 'data/game-config';

import AIPlayer from 'modules/ai/player';
import Character from 'modules/character';
import Player from 'modules/battle/player';

const itemSize = 100 / gridSize;

interface IGridChactersProps {
	actor: Character | null;
	players: Array<Player | AIPlayer>;
	characters: Character[];
}

const GridCharacters: React.SFC<IGridChactersProps> = ({ actor, characters, players }) => (
	<div className="GridCharacters">
		{characters.map((char, i) => {
			if (char.isDead()) {
				return;
			}
			const { x, y } = char.position;
			const dir = char.direction.toLowerCase();

			let visualCls = 'GridCharacters-item-visual';
			visualCls += ' GridCharacters-item-visual--player-' + players.indexOf(char.player);

			if (actor === char) {
				visualCls += ' is-selected';
			}

			if (char.status.has('DYING')) {
				visualCls += ' is-dying';
			}
			return (
				<div
					className="GridCharacters-item"
					style={
						{
							top: `${y * itemSize}%`,
							left: `${x * itemSize}%`,
							width: `${itemSize}%`,
							height: `${itemSize}%`,
						}
					}
					title={char.name}
					key={i}
				>
					<div className={visualCls}>
						{char.name.substring(0, 4).toUpperCase()}
						<div className={`GridCharacters-item-dir GridCharacters-item-dir--${dir}`} />
					</div>
				</div>
			);
		})}
	</div>
);

export default GridCharacters;
