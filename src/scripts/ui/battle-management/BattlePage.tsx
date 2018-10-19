import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { goto } from 'core/navigation';
import { withContext, IContext } from 'context';
import Engine, { IEngineState } from 'modules/battle/engine';

import BattleUI from 'ui/battle/BattleUI';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

const exit = (history: History) => () => {
	 // go to Main Menu
	if (window.confirm(txtExitConfirm)) {
		goto(history, '/');
	}
};

type IBattlePageContainerProps = RouteComponentProps<any> & IContext;

interface IBattlePageContainerState {
	engineState?: IEngineState;
	engineUpdate?: Date;
}

class BattlePageContainer extends React.Component<IBattlePageContainerProps, IBattlePageContainerState> {
	private engine: Engine;

	constructor(props: IBattlePageContainerProps) {
		super(props);

		const { battleConfig, parties } = this.props.store;
		this.state = {};

		this.engine = new Engine({
			players: battleConfig.players,
			parties: parties.data,
			events: {
				onStart: engineState => {
					this.setState({ engineState, engineUpdate: new Date() });
				},
				onUpdate: engineState => {
					this.setState({ engineState, engineUpdate: new Date() });
				},
				onGameOver: engineState => {
					throw new Error('TODO: Game Over');

					const now = new Date();
					this.setState(
						state => ({ engineState, engineUpdate: now }),
						() => exit(props.history)
					);
				}
			}
		});
	}

	public componentDidMount() {
		this.engine.start();
	}

	public render() {
		const { state, engine } = this;
		const { engineState, engineUpdate } = state;
		const onTileSelect = engine.selectTile.bind(engine);
		const onActionSelect = engine.selectAction.bind(engine);

		return (
			<BattleUI
				engineState={engineState}
				engineUpdate={engineUpdate}
				onTileSelect={onTileSelect}
				onActionSelect={onActionSelect}
			/>
		);
	}
}

export default withRouter(
	withContext(BattlePageContainer)
);
