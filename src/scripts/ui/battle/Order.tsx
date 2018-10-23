import React from 'react';

import Act from 'modules/battle/act';
import Character from 'modules/character';

interface IOrderProps {
	act: Act|null;
	characters: Character[];
}

const getState = (act: Act|null, char: Character): string|null => {
	const isDead = char.isDead();
	const isActive = !!(act && act.getActor() === char);
	return (isDead ? 'is-dead' : (isActive ? 'is-active' : null));
};

const Order: React.SFC<IOrderProps> = ({ act, characters }) => (
	<div className="Order">
		<h3 className="Heading">Order</h3>

		<table className="Order-list">
			<thead>
				<tr>
					<th className="Order-list-heading Order-list-heading--number">Nr</th>
					<th className="Order-list-heading Order-list-heading--title">Name</th>
					<th className="Order-list-heading Order-list-heading--ct">CT</th>
					<th className="Order-list-heading Order-list-heading--spd">SPD</th>
				</tr>
			</thead>

			<tbody>
				{characters.map((char, i) => {
					const charState = getState(act, char);
					return (
						<tr className={`Order-list-item ${charState || ''}`} key={i}>
							<td className="Order-list-item-row Order-list-item-row--number">{i}.</td>
							<td className="Order-list-item-row Order-list-item-row--title">{char.name}</td>
							<td className="Order-list-item-row Order-list-item-row--ct">{char.attributes.CT}</td>
							<td className="Order-list-item-row Order-list-item-row--spd">{char.attributes.SPD}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	</div>
);

export default Order;
