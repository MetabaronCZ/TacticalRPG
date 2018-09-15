import React from 'react';

import { IEngineState } from 'engine';
import Position from 'engine/position';
import CharacterAction from 'engine/character-action';

import ActUI from 'components/Game/components/Debug/Act';
import Grid from 'components/Game/components/Debug/Grid';
import Order from 'components/Game/components/Debug/Order';
import Characters from 'components/Game/components/Debug/Characters';

interface IDebugProps {
	engineState?: IEngineState;
	engineUpdate?: Date;
	onTileSelect: (pos: Position) => void;
	onActionSelect: (action: CharacterAction) => void;
}

const Debug: React.SFC<IDebugProps> = ({ engineState, engineUpdate, onTileSelect, onActionSelect }) => {
	if (!engineState || !engineUpdate) {
		return <div>Loading...</div>;
	}
	const { players, characters, order, act, tick } = engineState;

	if (null === act) {
		return <div>Waiting for act to start [Tick {tick}]...</div>;
	}
	return (
		<div className="Paragraph" style={{ textAlign: 'left', padding: '40px', }}>
			<br/>
			<h2>
				ACT {act.getId()} ({engineUpdate.toLocaleTimeString()}) [Tick {tick}]
			</h2>
			<br/>

			<table style={{ width: '100%', }}>
				<tbody>
					<tr>
						<td style={{ verticalAlign: 'top', width: '200px', }}>
							<Order act={act} characters={order} />
						</td>

						<td style={{ verticalAlign: 'top', paddingLeft: '40px', width: '300px', }}>
							<Characters act={act} players={players} />
						</td>

						<td style={{ verticalAlign: 'top', paddingLeft: '40px', }}>
							<ActUI act={act} onActionSelect={onActionSelect}/>
						</td>

						<td style={{ verticalAlign: 'top', paddingLeft: '40px', width: '400px', }}>
							<Grid
								act={act}
								players={players}
								characters={characters}
								onTileSelect={onTileSelect}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default Debug;
