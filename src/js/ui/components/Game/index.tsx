import React from 'react';

import Grid from 'ui/components/Game/components/Grid';
import Order from 'ui/components/Game/components/Order';
import Party from 'ui/components/Game/components/Party';
import Layers from 'ui/components/Game/components/Layers';
import Characters from 'ui/components/Game/components/Characters';

import { IParty } from 'models/party';
import { IGame, Game } from 'models/game';
import { ICharacterData } from 'models/character-data';

interface IGameUIProps {
	party: IParty;
	characters: ICharacterData[];
	onExit: () => void;
	onSummary: () => void;
}

class GameUI extends React.Component<IGameUIProps, IGame> {
	constructor(props: IGameUIProps) {
		super(props);
		this.state = Game.init(props.party.characters, props.characters);
	}

	public render() {
		const { order, characters } = this.state;

		return (
			<div className="GameUI">
				<div className="GameUI-column  GameUI-column--order">
					<Order order={order} characters={characters} />
				</div>

				<div className="GameUI-column GameUI-column--main">
					<Layers>
						<Grid />
						<Characters characters={characters} />
					</Layers>
				</div>

				<div className="GameUI-column GameUI-column--party">
					<Party characters={characters} />
				</div>
			</div>
		);
	}
}

export default GameUI;
