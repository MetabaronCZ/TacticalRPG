import React from 'react';

import Grid from 'components/Game/components/Grid';
import Info from 'components/Game/components/Info';
import Order from 'components/Game/components/Order';
import Party from 'components/Game/components/Party';
import Layers from 'components/Game/components/Layers';
import Characters from 'components/Game/components/Characters';
import { IGameUIProps } from 'components/Game';

const GameUI: React.SFC<IGameUIProps> = (props) => {
	const { order, characters } = props.store;

	return (
		<div className="GameUI">
			<div className="GameUI-column  GameUI-column--order">
				<Order order={order} characters={characters} />
			</div>

			<div className="GameUI-column GameUI-column--main">
				<Layers>
					<Characters characters={characters} onSelect={props.onCharacterSelect} />
					<Grid onSelect={props.onGridSelect} />
				</Layers>
			</div>

			<div className="GameUI-column GameUI-column--info">
				<Info x="10" />
			</div>

			<div className="GameUI-column GameUI-column--party">
				<Party characters={characters} />
			</div>
		</div>
	);
};

export default GameUI;
