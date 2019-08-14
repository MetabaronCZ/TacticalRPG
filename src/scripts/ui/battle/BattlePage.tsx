import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoRoute } from 'core/navigation';
import { withContext, IContext } from 'context';

import BattleUI from 'ui/battle/BattleUI';

import Summary from 'modules/battle/summary';
import Engine, { IEngineState } from 'modules/battle/engine';
import Tile from 'modules/geometry/tile';
import Command from 'modules/battle/command';

type IProps = RouteComponentProps<any> & IContext;

interface IState {
	engine: IEngineState;
}

const onExit = (history: History) => () => {
	gotoRoute(history, 'BATTLE_SUMMARY');
};

class BattlePageContainer extends React.Component<IProps, IState> {
	public state: IState;
	private engine: Engine;

	constructor(props: IProps) {
		super(props);

		const { battleConfig, parties, characters } = this.props.store;

		this.engine = new Engine({
			characters: characters.data,
			players: battleConfig.players,
			parties: parties.data,
			events: {
				onUpdate: engineState => {
					this.setState(state => ({
						engine: engineState
					}));
				},
				onGameOver: (engineState, winner) => {
					const record = engineState.chronox;

					if (!record) {
						throw new Error('Cannot properly end the game: Invalid Chronox record');
					}
					Summary.save(record, winner.id);

					this.setState(state => ({
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
				},
			}
		});

		this.state = {
			engine: this.engine.getState()
		};
	}

	public componentDidMount() {
		this.engine.start();
	}

	public render() {
		const { history } = this.props;
		const { engine: engineState } = this.state;
		return (
			<BattleUI
				engineState={engineState}
				onTileSelect={this.onTileSelect}
				onCommandSelect={this.onCommandSelect}
				onExit={onExit(history)}
			/>
		);
	}

	private onTileSelect = (tile: Tile) => {
		const { act } = this.state.engine;
		const actingChar = act ? act.actingCharacter : null;

		if (actingChar && !actingChar.isAI()) {
			this.engine.selectTile(tile);
		}
	}

	private onCommandSelect = (command: Command) => {
		const { act } = this.state.engine;
		const actingChar = act ? act.actingCharacter : null;

		if (actingChar && !actingChar.isAI()) {
			this.engine.selectCommand(command);
		}
	}
}

export default withRouter(
	withContext(BattlePageContainer)
);
