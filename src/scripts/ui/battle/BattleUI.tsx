import React from 'react';

import Tile from 'modules/geometry/tile';
import Command from 'modules/battle/command';
import { IEngineState } from 'modules/battle/engine';

import Button from 'ui/common/Button';

import Grid from 'ui/battle/Grid';
import Order from 'ui/battle/Order';
import ActorUI from 'ui/battle/ActorUI';
import TargetUI from 'ui/battle/TargetUI';
import ReactorUI from 'ui/battle/ReactorUI';
import GridLegend from 'ui/battle/GreidLegend';
import GridCoordinates from 'ui/battle/GridCoordinates';

interface IBattleUIProps {
	engineState: IEngineState;
	engineUpdate: Date | null;
	onTileSelect: (tile: Tile) => void;
	onCommandSelect: (command: Command) => void;
	onExit: () => void;
}

const BattleUI: React.SFC<IBattleUIProps> = ({ engineState, engineUpdate, onTileSelect, onCommandSelect: onCommandSelect, onExit }) => {
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

			<div className="BattleUI-layout">
				<div className="BattleUI-layout-column BattleUI-layout-column--actor">
					{running
						? <ActorUI act={act} onCommandSelect={onCommandSelect} />
						: (
							<React.Fragment>
								<h2 className="Heading">Game Over</h2>
								<Button text="Show summary" onClick={onExit} />
							</React.Fragment>
						)
					}
				</div>

				<div className="BattleUI-layout-column BattleUI-layout-column--grid">
					<GridCoordinates>
						<Grid
							act={act}
							players={players}
							characters={characters}
							battleInfo={battleInfo}
							onTileSelect={onTileSelect}
						/>
					</GridCoordinates>

					<GridLegend act={act} players={players} />
				</div>

				<div className="BattleUI-layout-column BattleUI-layout-column--reactor">
					{running && (
						'COMMAND' === act.getPhase()
							? <TargetUI act={act} />
							: <ReactorUI act={act} onCommandSelect={onCommandSelect} />
					)}
				</div>
			</div>
		</div>
	);
};

export default BattleUI;
