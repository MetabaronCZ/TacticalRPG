import React from 'react';

import Tile from 'modules/geometry/tile';
import { IEngineState } from 'modules/battle/engine';
import CharacterAction from 'modules/battle/character-action';

import Grid from 'ui/battle/Grid';
import ActUI from 'ui/battle/Act';
import Order from 'ui/battle/Order';
import Players from 'ui/battle/Players';
import GridCoordinates from 'ui/battle/GridCoordinates';
import Button from 'ui/common/Button';

interface IBattleUIProps {
	engineState: IEngineState;
	engineUpdate: Date | null;
	onTileSelect: (tile: Tile) => void;
	onActionSelect: (action: CharacterAction) => void;
	onExit: () => void;
}

const BattleUI: React.SFC<IBattleUIProps> = ({ engineState, engineUpdate, onTileSelect, onActionSelect, onExit }) => {
	if (!engineUpdate) {
		return <p className="Paragraph">Loading...</p>;
	}
	const { players, characters, order, act, tick, running, battleInfo } = engineState;

	if (!act) {
		return <p className="Paragraph">Waiting for act to start [Tick {tick}]...</p>;
	}
	return (
		<div className="BattleUI">
			<Order act={act} characters={order} players={players} />

			<table className="BattleUI-table">
				<tbody>
					<tr>
						<td className="BattleUI-table-column BattleUI-table-column--players">
							<Players act={act} players={players} />
						</td>

						<td className="BattleUI-table-column" />

						<td className="BattleUI-table-column BattleUI-table-column--actions">
							{running
								? <ActUI act={act} onActionSelect={onActionSelect}/>
								: (
									<React.Fragment>
										<h2 className="Heading">Game Over</h2>
										<Button text="Show summary" onClick={onExit} />
									</React.Fragment>
								)
							}
						</td>

						<td className="BattleUI-table-column BattleUI-table-column--grid">
							<GridCoordinates>
								<Grid
									act={act}
									players={players}
									characters={characters}
									battleInfo={battleInfo}
									onTileSelect={onTileSelect}
								/>
							</GridCoordinates>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default BattleUI;
