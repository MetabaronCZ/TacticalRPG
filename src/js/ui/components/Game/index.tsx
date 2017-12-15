import React from 'react';
import Order from 'ui/components/Game/components/Order';
import Party from 'ui/components/Game/components/Party';
import Grid from 'ui/components/Game/components/Grid';

import Engine from 'engine';
import Character from 'engine/character';
import { IParty } from 'models/party';
import { ICharacter } from 'models/character';

const gridSize: number = 12;
const blockSize: number = 64;

interface IGameProps {
	party: IParty;
	characters: ICharacter[];
	onExit: () => void;
	onSummary: () => void;
}

class Game extends React.Component {
	public props: IGameProps;
	private party: Character[];
	private order: Character[];
	private onExit: () => void;
	private onSummary: () => void;

	constructor(props: IGameProps) {
		super(props);

		const engine: Engine = new Engine({
			party: props.party,
			characters: props.characters,
			size: gridSize
		});

		this.party = engine.getParty();
		this.order = engine.getOrder();

		/* */
		this.onExit = props.onExit.bind(this);
		this.onSummary = props.onSummary.bind(this);
		/* */
	}

	public render() {
		// filter valid character slots
		const party: Character[] = this.party;
		const order: Character[] = this.order;

		return (
			<div className="GameUI">
				<div className="GameUI-column  GameUI-column--order">
					<Order characters={order} />
				</div>

				<div className="GameUI-column GameUI-column--grid">
					<Grid size={gridSize} blockSize={blockSize} />
				</div>

				<div className="GameUI-column GameUI-column--party">
					<Party characters={party} />
				</div>
			</div>
		);
	}
}

export default Game;
