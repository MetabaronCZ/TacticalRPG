import React from 'react';
import Character from 'engine/character';

interface IOrderProps {
	characters: Character[];
}

const Order = ({ characters }: IOrderProps): JSX.Element => (
	<div className="Order">
		<h2 className="Heading">Order</h2>

		{characters.map((char: Character, i: number) => (
			<div className={`Order-item Order-item--${char.getPlayer().isEnemy() ? 'enemy' : 'ally'}`} key={i}>
				<div className="Order-item-inner">
					{char.job} {char.name} <small>| SPD {char.getAttributes().current.SPD}</small>
				</div>
			</div>
		))}
	</div>
);

export default Order;
