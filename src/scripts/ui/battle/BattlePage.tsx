import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoRoute } from 'core/navigation';
import { withContext, IContext } from 'context';

import BattleUI from 'ui/battle/BattleUI';

import Summary from 'modules/battle/summary';
import Engine, { IEngineState } from 'modules/battle/engine';

type IProps = RouteComponentProps<any> & IContext;

interface IState {
	engineState: IEngineState;
	engineUpdate: Date | null;
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
				onStart: engineState => {
					this.setState({ engineState, engineUpdate: new Date() });
				},
				onUpdate: engineState => {
					this.setState({ engineState, engineUpdate: new Date() });
				},
				onGameOver: (engineState, winner) => {
					const record = engineState.chronox;

					if (!record) {
						throw new Error('Cannot properly end the game: Invalid Chronox record');
					}
					Summary.save(record, engineState.characters, winner.id);

					this.setState(state => ({
						engineState,
						engineUpdate: new Date()
					}));
				},
				onBattleInfo: info => {
					this.setState(state => ({
						engineState: {
							...state.engineState,
							battleInfo: info
						},
						engineUpdate: new Date()
					}));
				},
			}
		});

		this.state = {
			engineState: this.engine.getState(),
			engineUpdate: null
		};
	}

	public componentDidMount() {
		this.engine.start();
	}

	public render() {
		const { history } = this.props;
		const { engineState, engineUpdate } = this.state;

		const engine = this.engine;
		const onTileSelect = engine.selectTile.bind(engine);
		const onCommandSelect = engine.selectCommand.bind(engine);

		return (
			<BattleUI
				engineState={engineState}
				engineUpdate={engineUpdate}
				onTileSelect={onTileSelect}
				onCommandSelect={onCommandSelect}
				onExit={onExit(history)}
			/>
		);
	}
}

export default withRouter(
	withContext(BattlePageContainer)
);
