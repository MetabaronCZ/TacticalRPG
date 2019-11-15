import React from 'react';
import { IOrderSnapshot, IOrderCharacter } from 'modules/battle/order';

interface IOrderProps {
	readonly actor: string;
	readonly order: IOrderSnapshot;
}

const getState = (actorID: string, char: IOrderCharacter): string => {
	const isActive = (actorID === char.id);
	return (char.dying ? 'dying' : (isActive ? 'active' : ''));
};

const Order: React.SFC<IOrderProps> = ({ actor, order }) => (
	<ul className="Order">
		{order.characters.map(char => {
			if (char.dead || char.dying) {
				return;
			}
			const charState = getState(actor, char);
			return (
				<li
					className={`Order-item Order-item--type${char.player} is-${charState}`}
					key={char.order}
				>
					{char.name}
				</li>
			);
		})}
	</ul>
);

export default Order;
