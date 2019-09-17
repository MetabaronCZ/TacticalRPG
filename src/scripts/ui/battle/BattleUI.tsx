import React from 'react';

import Tile from 'modules/geometry/tile';
import Command from 'modules/battle/command';
import { ICharacterSnapshot } from 'modules/character';
import { IEngineSnapshot } from 'modules/battle/engine';

import Button from 'ui/common/Button';

import Order from 'ui/battle/Order';
import EmptyUI from 'ui/battle/EmptyUI';
import ActorUI from 'ui/battle/ActorUI';
import TargetUI from 'ui/battle/TargetUI';
import HexaGrid from 'ui/battle/HexaGrid';

interface IBattleUIProps {
	readonly engine: IEngineSnapshot;
	readonly onTileSelect: (tile: Tile) => void;
	readonly onCommandSelect: (command: Command) => void;
	readonly onExit: () => void;
}

const BattleUI: React.SFC<IBattleUIProps> = ({ engine: engineState, onTileSelect, onCommandSelect, onExit }) => {
	const { characters, order, act, tick, running, battleInfo } = engineState;

	if (!act) {
		return <p className="Paragraph">Waiting for act to start [Tick {tick}]...</p>;
	}
	let commands: Command[] = [];
	let target: ICharacterSnapshot | null = null;
	let info = '';

	if (running) {
		switch (act.phase) {
			case 'COMMAND':
				target = act.phases.COMMAND.effectTarget;
				break;

			case 'REACTION': {
				const { reaction } = act.phases.REACTION;

				if (reaction) {
					target = reaction.reactor;
					commands = act.commands;
					info = act.info;

					if (target.isAI) {
						info = '';
						commands = [];
					}
				}
				break;
			}

			default:
				// do nothing
		}
	}
	return (
		<div className="BattleUI">
			<div className="BattleUI-layout">
				<div className="BattleUI-layout-column BattleUI-layout-column--order">
					<Order actor={act.actor.id} order={order} />
				</div>

				<div className="BattleUI-layout-column BattleUI-layout-column--character">
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

				<div className="BattleUI-layout-column BattleUI-layout-column--character">
					{target
						? <TargetUI
							info={info}
							character={target}
							commands={commands}
							onCommandSelect={onCommandSelect}
						/>
						: <EmptyUI />
					}
				</div>
			</div>
		</div>
	);
};

export default BattleUI;
