import React from 'react';

import Order from 'ui/components/Game/components/Order';
import Party from 'ui/components/Game/components/Party';
import Grid from 'ui/components/Game/components/Grid';
import Layers from 'ui/components/Game/components/Layers';
import Characters from 'ui/components/Game/components/Characters';

import { IPartyData } from 'models/party';
import { ICharacterData } from 'models/character';
import { Engine, IEngineState } from 'models/engine';

const gridSize = 12;
const blockSize = 64;

interface IGameProps {
	party: IPartyData;
	characters: ICharacterData[];
	onExit: () => void;
	onSummary: () => void;
}

interface IGameState {
	engine: IEngineState;
}

class Game extends React.Component<IGameProps, IGameState> {
	private engine: Engine;

	constructor(props: IGameProps) {
		super(props);

		this.engine = new Engine({
			party: props.party,
			characters: props.characters,
			size: gridSize
		});

		this.state = {
			engine: this.engine.getState()
		};
	}

	public update() {
		this.setState({
			engine: this.engine.getState()
		});
	}

	public render() {
		const { ally, enemy, order } = this.state.engine;

		return (
			<div className="GameUI">
				<div className="GameUI-column  GameUI-column--order">
					<Order characters={order} />
				</div>

				<div className="GameUI-column GameUI-column--main">
					<Layers size={gridSize} blockSize={blockSize}>
						<Grid size={gridSize} blockSize={blockSize} />
						<Characters ally={ally} enemy={enemy} size={gridSize} blockSize={blockSize} />
					</Layers>
				</div>

				<div className="GameUI-column GameUI-column--party">
					<Party characters={ally} />
				</div>
			</div>
		);
	}
}

export default Game;
