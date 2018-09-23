import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import * as Selector from 'selectors';
import { goto } from 'utils/nav';

import Engine, { IEngineState } from 'engine';
import { PartyData } from 'engine/party-data';
import { IBattleConfig } from 'engine/battle-config';
import { CharacterData } from 'engine/character-data';

import BattleUI from 'ui/battle/BattleUI';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

interface IStateToProps {
	readonly battleConfig: IBattleConfig;
	readonly characters: CharacterData[];
	readonly parties: PartyData[];
}

const exit = (history: History) => () => {
	 // go to Main Menu
	if (window.confirm(txtExitConfirm)) {
		goto(history, '/');
	}
};

const mapStateToProps = (state: IStore): IStateToProps => ({
	battleConfig: Selector.getBattleConfig(state),
	characters: Selector.getCharacters(state),
	parties: Selector.getParties(state)
});

type IBattlePageContainerProps = IStateToProps & RouteComponentProps<any>;

interface IBattlePageContainerState {
	engineState?: IEngineState;
	engineUpdate?: Date;
}

class BattlePageContainer extends React.Component<IBattlePageContainerProps, IBattlePageContainerState> {
	private engine: Engine;

	constructor(props: IBattlePageContainerProps) {
		super(props);

		this.state = {};

		this.engine = new Engine({
			players: props.battleConfig.players.map(conf => ({
				name: conf.name,
				control: conf.control,
				party: conf.party,
				parties: props.parties,
				characters: props.characters
			})),
			events: {
				onStart: engineState => {
					const now = new Date();
					this.setState(state => ({ engineState, engineUpdate: now }));
				},
				onUpdate: engineState => {
					const now = new Date();
					this.setState(state => ({ engineState, engineUpdate: now }));
				},
				onGameOver: engineState => {
					const now = new Date();

					throw new Error('TODO: Game Over');

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
	connect(mapStateToProps)(BattlePageContainer)
);
