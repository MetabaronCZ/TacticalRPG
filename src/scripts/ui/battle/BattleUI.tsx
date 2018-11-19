import React from 'react';

import Tile from 'modules/geometry/tile';
import { IEngineState } from 'modules/battle/engine';
import CharacterAction from 'modules/battle/character-action';

import ActUI from 'ui/battle/Act';
import Grid from 'ui/battle/Grid';
import Order from 'ui/battle/Order';
import Players from 'ui/battle/Players';

interface IBattleUIProps {
	engineState: IEngineState;
	engineUpdate: Date|null;
	onTileSelect: (tile: Tile) => void;
	onActionSelect: (action: CharacterAction) => void;
}

const BattleUI: React.SFC<IBattleUIProps> = ({ engineState, engineUpdate, onTileSelect, onActionSelect }) => {
	if (null === engineUpdate) {
		return <div>Loading...</div>;
	}
	const { players, characters, order, act, tick, battleInfo } = engineState;

	if (null === act) {
		return <div>Waiting for act to start [Tick {tick}]...</div>;
	}
	return (
		<div className="BattleUI">
			<h2 className="BattleUI-heading">
				ACT {act.getId()} ({engineUpdate.toLocaleTimeString()}) [Tick {tick}]
			</h2>

			<table className="BattleUI-table">
				<tbody>
					<tr>
						<td className="BattleUI-table-column BattleUI-table-column--order">
							<Order act={act} characters={order} />
						</td>

						<td className="BattleUI-table-column BattleUI-table-column--players">
							<Players act={act} players={players} />
						</td>

						<td className="BattleUI-table-column">
							<ActUI act={act} onActionSelect={onActionSelect}/>
						</td>

						<td className="BattleUI-table-column BattleUI-table-column--grid">
							<Grid
								act={act}
								players={players}
								characters={characters}
								battleInfo={battleInfo}
								onTileSelect={onTileSelect}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default BattleUI;
