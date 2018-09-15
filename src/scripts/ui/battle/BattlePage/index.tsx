import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';
import { isDebug } from 'data/game-config';

import { IParty } from 'modules/party/types';
import { ICharacterData } from 'modules/character-data/types';

import Debug from 'ui/battle/Debug';
import BattleUIContainer from 'ui/battle/BattleUI';

import Engine, { IEngineState } from 'engine';
import { IBattleConfig } from 'engine/battle-config';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

interface IStateToProps {
	readonly battleConfig: IBattleConfig;
	readonly characters: ICharacterData[];
	readonly parties: IParty[];
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
		const { characters, parties, battleConfig, history } = this.props;

		if (isDebug) {
			const engine = this.engine;
			const { engineState, engineUpdate } = this.state;
			const onTileSelect = engine.selectTile.bind(engine);
			const onActionSelect = engine.selectAction.bind(engine);

			return (
				<Debug
					engineState={engineState}
					engineUpdate={engineUpdate}
					onTileSelect={onTileSelect}
					onActionSelect={onActionSelect}
				/>
			);
		}
		return (
			<BattleUIContainer
				parties={parties}
				characters={characters}
				config={battleConfig}
				onExit={exit(history)}
				onSummary={gotoFn(history, '/battle-summary')}
			/>
		);
	}
}

export default withRouter(
	connect(mapStateToProps)(BattlePageContainer)
);
