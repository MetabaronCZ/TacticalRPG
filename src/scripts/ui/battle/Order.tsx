import React from 'react';

import Character from 'modules/character';
import Player from 'modules/battle/player';

interface IOrderProps {
	readonly actor: Character;
	readonly players: Player[];
	readonly characters: Character[];
}

const getState = (actor: Character, char: Character): string => {
	const isDying = char.status.has('DYING');
	const isActive = (actor === char);
	return (isDying ? 'dying' : (isActive ? 'active' : ''));
};

const Order: React.SFC<IOrderProps> = ({ actor, characters, players }) => (
	<ul className="Order">
		{characters.map((char, i) => {
			if (char.isDead()) {
				return;
			}
			const charState = getState(actor, char);
			const charPlayer = players.indexOf(char.player);
			return (
				<li className={`Order-item Order-item--type${charPlayer} is-${charState}`} key={i}>
					<div className="Order-item-title">
						{i + 1}. {char.name}
					</div>

					<div className="Order-item-info">
						CT: {char.attributes.CT} | SPD: {char.attributes.SPD}
					</div>
				</li>
			);
		})}
	</ul>
);

export default Order;
