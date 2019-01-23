import React from 'react';

import Act from 'modules/battle/act';
import Character from 'modules/character';
import Player from 'modules/battle/player';

interface IOrderProps {
	act: Act|null;
	players: Player[];
	characters: Character[];
}

const getState = (act: Act|null, char: Character): string => {
	const isDead = char.isDead();
	const isActive = !!(act && act.getActor() === char);
	return (isDead ? 'dead' : (isActive ? 'active' : ''));
};

const Order: React.SFC<IOrderProps> = ({ act, characters, players }) => (
	<ul className="Order">
		{characters.map((char, i) => {
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
