import React from 'react';

import Act from 'engine/act';
import Character from 'engine/character';

interface IOrderProps {
	act: Act|null;
	characters: Character[];
}

const getcolor = (act: Act|null, char: Character) => {
	const isDead = char.isDead();
	const isActive = !!(act && act.getActor() === char);
	return (isDead ? 'darkred' : (isActive ? 'black' : ''));
};

const Order: React.SFC<IOrderProps> = ({ act, characters }) => (
	<div>
		<h3 className="Heading">Order</h3>

		<table style={{ width: '100%', borderCollapse: 'collapse', }}>
			<thead>
				<tr>
					<th>Nr</th>
					<th>Name</th>
					<th style={{ textAlign: 'right', paddingLeft: '5px', }}>CT</th>
					<th style={{ textAlign: 'right', paddingLeft: '5px', }}>SPD</th>
				</tr>
			</thead>

			<tbody>
				{characters.map((char, c) => (
					<tr key={c} style={{ backgroundColor: getcolor(act, char), }}>
						<td style={{ textAlign: 'right', }}>{c}.</td>
						<td style={{ paddingLeft: '10px', }}>
							<strong>{char.name}</strong>
						</td>
						<td style={{ textAlign: 'right', paddingLeft: '10px', }}>{char.attributes.get('CT')}</td>
						<td style={{ textAlign: 'right', paddingLeft: '10px', }}>{char.attributes.get('SPD')}</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default Order;
