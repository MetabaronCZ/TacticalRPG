import React from 'react';
import Order from 'ui/components/Game/components/Order';
import Party from 'ui/components/Game/components/Party';
import Grid from 'ui/components/Game/components/Grid';

import Engine from 'engine';

const gridSize = 12;
const blockSize = 64;

class Game extends React.Component {
	constructor({ party, onExit, onSummary }){
		super(...arguments);

		let engine = new Engine({ party, gridSize });
		this.party = engine.getParty();
		this.order = engine.getOrder();

		/* */this.onExit = onExit.bind(this);
		/* */this.onSummary = onSummary.bind(this);
	}

	render(){
		// filter valid character slots
		let party = this.party;
		let order = this.order;

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
