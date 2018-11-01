import React from 'react';

import { gridSize } from 'data/game-config';

import Character from 'modules/character';
import Player from 'modules/battle/player';

const itemSize = 100 / gridSize;

interface IGridChactersProps {
	actor: Character|null;
	players: Player[];
	characters: Character[];
}

const GridCharacters: React.SFC<IGridChactersProps> = ({ actor, characters, players }) => (
	<div className="GridCharacters">
		{characters.map((char, i) => {
			const { x, y } = char.position;
			const dir = char.direction.toLowerCase();

			let visualCls = 'GridCharacters-item-visual';
			visualCls += ' GridCharacters-item-visual--player-' + char.player;

			if (actor === char) {
				visualCls += ' is-selected';
			}

			if (char.isDead()) {
				visualCls += ' is-dead';
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
