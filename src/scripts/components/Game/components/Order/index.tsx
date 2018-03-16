import React from 'react';

import { IOrder } from 'models/order';
import { PlayerType } from 'models/player';
import { ICharacter } from 'models/character';

interface IOrderProps {
	order: IOrder;
	characters: ICharacter[];
}

const Order: React.SFC<IOrderProps> = ({ order, characters }) => {
	const ordered = order.map(id => {
		for (const char of characters) {
			if (id === char.data.id) {
				return char;
			}
		}
		throw new Error(`Could not create Order: Invalid Character ID (${id})`);
	});

	return (
		<div className="Order">
			<h2 className="Heading">Order</h2>

			{ordered.map((char, i) => (
				<div className={`Order-item Order-item--${PlayerType.ENEMY === char.player ? 'enemy' : 'ally'}`} key={i}>
					<div className="Order-item-inner">
						{char.data.job} {char.data.name} <small>| SPD {char.currAttributes.SPD} | CP {char.currAttributes.CP}</small>
					</div>
				</div>
			))}
		</div>
	);
};

export default Order;
