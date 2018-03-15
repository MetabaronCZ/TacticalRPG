import React from 'react';

import { IOrder } from 'models/order';
import { Position } from 'models/position';
import { ICharacter } from 'models/character';

import Grid from 'components/Game/components/Grid';
import Info from 'components/Game/components/Info';
import Order from 'components/Game/components/Order';
import Party from 'components/Game/components/Party';
import Layers from 'components/Game/components/Layers';
import Characters from 'components/Game/components/Characters';
import { IOnCharacterSelect, IOnGridSelect } from 'components/Game';

export interface IGameUIProps {
	order: IOrder;
	characters: ICharacter[];
	selected?: Position;
	onCharacterSelect: IOnCharacterSelect;
	onGridSelect: IOnGridSelect;
}

const GameUI: React.SFC<IGameUIProps> = props => {
	const { order, characters, selected } = props;

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
				<Info selected={selected} />
			</div>

			<div className="GameUI-column GameUI-column--party">
				<Party characters={characters} />
			</div>
		</div>
	);
};

export default GameUI;
