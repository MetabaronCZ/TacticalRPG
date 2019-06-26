import React from 'react';

import Act from 'modules/battle/act';
import Character from 'modules/character';
import Player from 'modules/battle/player';

interface IOrderProps {
	act: Act | null;
	players: Player[];
	characters: Character[];
}

const getState = (act: Act | null, char: Character): string => {
	const isDying = char.status.has('DYING');
	const isActive = !!(act && act.actor === char);
	return (isDying ? 'dying' : (isActive ? 'active' : ''));
};

const Order: React.SFC<IOrderProps> = ({ act, characters, players }) => (
	<ul className="Order">
		{characters.map((char, i) => {
			if (char.isDead()) {
				return;
			}
			const charState = getState(act, char);
			const charPlayer = players.indexOf(char.player);
			return (
				<li className={`Order-item Order-item--type${charPlayer} is-${charState}`} key={i}>
					{i + 1}. {char.name}
					<br />
					CT: {char.attributes.CT} | SPD: {char.attributes.SPD}
				</li>
			);
		})}
	</ul>
);

export default Order;
