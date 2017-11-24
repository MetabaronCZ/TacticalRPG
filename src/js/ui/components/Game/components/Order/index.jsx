import React from 'react';

const Order = ({ characters }) => (
	<div className="Order">
		<h2 className="Heading">Order</h2>

		{characters.map((char, i) => (
			<div className={`Order-item Order-item--${char.getPlayer().isEnemy() ? 'enemy' : 'ally'}`} key={i}>
				<div className="Order-item-inner">
					{char.job} {char.name}
				</div>
			</div>
		))}
	</div>
);

export default Order;
