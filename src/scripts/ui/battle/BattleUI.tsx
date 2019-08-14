import React from 'react';

import Tile from 'modules/geometry/tile';
import Command from 'modules/battle/command';
import { IEngineState } from 'modules/battle/engine';

import Button from 'ui/common/Button';

import Order from 'ui/battle/Order';
import ActorUI from 'ui/battle/ActorUI';
import TargetUI from 'ui/battle/TargetUI';
import ReactorUI from 'ui/battle/ReactorUI';

import HexaGrid from 'ui/battle/HexaGrid';

interface IBattleUIProps {
	readonly engineState: IEngineState;
	readonly onTileSelect: (tile: Tile) => void;
	readonly onCommandSelect: (command: Command) => void;
	readonly onExit: () => void;
}

const BattleUI: React.SFC<IBattleUIProps> = ({ engineState, onTileSelect, onCommandSelect, onExit }) => {
	const { players, characters, order, act, tick, running, battleInfo } = engineState;

	if (!act) {
		return <p className="Paragraph">Waiting for act to start [Tick {tick}]...</p>;
	}
	return (
		<div className="BattleUI">
			<Order actor={act.actor} characters={order} players={players} />

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
					<HexaGrid
						act={act}
						characters={characters}
						battleInfo={battleInfo}
						onTileSelect={onTileSelect}
					/>
				</div>

				<div className="BattleUI-layout-column BattleUI-layout-column--reactor">
					{running && (
						'COMMAND' === act.phase
							? <TargetUI act={act} />
							: <ReactorUI act={act} onCommandSelect={onCommandSelect} />
					)}
				</div>
			</div>
		</div>
	);
};

export default BattleUI;
