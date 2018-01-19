import React from 'react';
import Order from 'ui/components/Game/components/Order';
import Party from 'ui/components/Game/components/Party';
import Grid from 'ui/components/Game/components/Grid';
import Layers from 'ui/components/Game/components/Layers';
import Characters from 'ui/components/Game/components/Characters';

import Engine, { IEngineState } from 'engine';
import Character from 'engine/character';
import { IParty } from 'models/party';
import { ICharacter } from 'models/character';

const gridSize = 12;
const blockSize = 64;

interface IGameProps {
	party: IParty;
	characters: ICharacter[];
	onExit: () => void;
	onSummary: () => void;
}

interface IGameState {
	engine: IEngineState;
}

class Game extends React.Component {
	public props: IGameProps;
	public state: IGameState;
	private engine: Engine;
	private onExit: () => void;
	private onSummary: () => void;

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

		/* */
		this.onExit = props.onExit.bind(this);
		this.onSummary = props.onSummary.bind(this);
		/* */
	}

	public update() {
		this.setState({
			engine: this.engine.getState()
		});
	}

	public render() {
		const state = this.state.engine;
		const ally = state.ally;
		const enemy = state.enemy;
		const order = state.order;

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
