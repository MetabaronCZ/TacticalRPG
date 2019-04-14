import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoRoute } from 'core/navigation';
import { withContext, IContext } from 'context';
import Engine, { IEngineState } from 'modules/battle/engine';

import BattleUI from 'ui/battle/BattleUI';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

const exit = (history: History) => () => {
	 // go to Main Menu
	if (window.confirm(txtExitConfirm)) {
		gotoRoute(history, 'ROOT');
	}
};

type IProps = RouteComponentProps<any> & IContext;

interface IState {
	engineState: IEngineState;
	engineUpdate: Date|null;
}

class BattlePageContainer extends React.Component<IProps, IState> {
	public state: IState = {
		engineState: {
			tick: 0,
			act: null,
			battleInfo: [],
			characters: [],
			players: [],
			order: [],
			chronox: []
		},
		engineUpdate: null
	};
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
				onGameOver: engineState => {
					const record = engineState.chronox.map(ch => ({
						id: ch.id,
						actor: {
							name: ch.actor.name,
							player: ch.actor.player.getName(),
							sex: ch.actor.sex.id,
							archetype: ch.actor.archetype.id,
							skillset: ch.actor.skillset.id,
							mainHand: ch.actor.mainHand.id,
							offHand: ch.actor.offHand.id,
							armor: ch.actor.armor.id
						},
						movePhase: {
							initialPosition: ch.movePhase.initialPosition.id,
							target: ch.movePhase.target.id
						},
						actionPhase: {
							action: (ch.actionPhase.action ? ch.actionPhase.action.title : null),
							effectTarget: (ch.actionPhase.effectTarget ? ch.actionPhase.effectTarget.id : null),
							reactions: ch.actionPhase.reactions.map(r => ({
								id: r.id,
								reactor: {
									name: r.reactor.name,
									player: r.reactor.player.getName(),
									sex: r.reactor.sex.id,
									archetype: r.reactor.archetype.id,
									skillset: r.reactor.skillset.id,
									mainHand: r.reactor.mainHand.id,
									offHand: r.reactor.offHand.id,
									armor: r.reactor.armor.id
								},
								action: (r.action ? r.action.title : null),
								evasionTarget: (r.evasionTarget ? r.evasionTarget.id : null),
								result: r.result
							}))
						},
						directPhase: {
							target: (ch.directPhase.target ? ch.directPhase.target.id : null)
						}
					}));

					console.log('Chronox', record);
					throw new Error('TODO: Game Over');

					this.setState(
						state => ({ engineState, engineUpdate: new Date() }),
						() => exit(props.history)
					);
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
	}

	public componentDidMount() {
		this.engine.start();
	}

	public render() {
		const engine = this.engine;
		const onTileSelect = engine.selectTile.bind(engine);
		const onActionSelect = engine.selectAction.bind(engine);

		return (
			<BattleUI
				engineState={this.state.engineState}
				engineUpdate={this.state.engineUpdate}
				onTileSelect={onTileSelect}
				onActionSelect={onActionSelect}
			/>
		);
	}
}

export default withRouter(
	withContext(BattlePageContainer)
);
