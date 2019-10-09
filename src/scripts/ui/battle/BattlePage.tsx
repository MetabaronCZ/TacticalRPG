import React from 'react';
import { History } from 'history';
import { } from 'react-router';

import { gotoRoute } from 'core/navigation';
import { withContext, IContext } from 'context';

import BattleUI from 'ui/battle/BattleUI';

import Tile from 'modules/geometry/tile';
import Summary from 'modules/battle/summary';
import Engine, { IEngineSnapshot } from 'modules/battle/engine';

type IProps = IContext;

interface IState {
	engine: IEngineSnapshot;
}

const onExit = (history: History): void => {
	gotoRoute(history, 'BATTLE_SUMMARY');
};

class BattlePageContainer extends React.Component<IProps, IState> {
	public state: IState;
	private engine: Engine;

	constructor(props: IProps) {
		super(props);

		const { battleConfig, characters, parties } = props.store;

		this.engine = new Engine({
			characters: characters.data,
			players: battleConfig.players,
			parties: parties.data,
			events: {
				onUpdate: engineState => {
					this.setState(() => ({
						engine: engineState
					}));
				},
				onGameOver: (engineState, winner) => {
					const record = engineState.chronox;

					if (!record) {
						throw new Error('Cannot properly end the game: Invalid Chronox record');
					}
					Summary.save(record, winner.id);

					this.setState(() => ({
						engine: engineState
					}));
				},
				onBattleInfo: info => {
					this.setState(state => ({
						engine: {
							...state.engine,
							battleInfo: info
						}
					}));
				}
			}
		});

		this.state = {
			engine: this.engine.serialize()
		};
	}

	public componentDidMount(): void {
		this.engine.start();
	}

	public render(): React.ReactNode {
		const { engine: engineState } = this.state;
		return (
			<BattleUI
				engine={engineState}
				onTileSelect={this.onTileSelect}
				onCommandSelect={this.onCommandSelect}
				onExit={onExit}
			/>
		);
	}

	private onTileSelect = (tile: Tile): void => {
		const { act } = this.state.engine;
		const actingChar = act ? act.actingCharacter : null;

		if (actingChar && !actingChar.isAI) {
			this.engine.selectTile(tile);
		}
	}

	private onCommandSelect = (commandID: string): void => {
		const { act } = this.state.engine;
		const actingChar = act ? act.actingCharacter : null;

		if (actingChar && !actingChar.isAI) {
			this.engine.selectCommand(commandID);
		}
	}
}

export default withContext(BattlePageContainer);
