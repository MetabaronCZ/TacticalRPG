import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoRoute } from 'core/navigation';

import { IRouteParams } from 'modules/route';
import Summary, { ISummary } from 'modules/battle/summary';
import { analyzeScore, topListSize } from 'modules/battle-summary/score';
import { getSummaryItem, ISummaryItem } from 'modules/battle-summary/summary';
import { getPlayerData, ISummaryPlayerData } from 'modules/battle-summary/player';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import Separator from 'ui/common/Separator';
import ButtonRow from 'ui/common/ButtonRow';
import PlayerIco from 'ui/common/PlayerIco';
import CommandTitle from 'ui/battle/CommandTitle';
import SummaryScore from 'ui/battle-summary/SummaryScore';
import SummaryPlayers from 'ui/battle-summary/SummaryPlayers';

type IProps = RouteComponentProps<IRouteParams>;

interface IState {
	record: ISummary | null;
}

const exit = (history: History) => () => {
	gotoRoute(history, 'ROOT');
};

const renderSummaryItem = (item: ISummaryItem, player: ISummaryPlayerData, row: number): React.ReactNode => (
	<li className="List-row" key={item.id}>
		<div className="List-row-column u-tableColumnFit u-align-top u-align-right">
			{row}.
		</div>

		<div className="List-row-column u-tableColumnFit u-align-top u-align-right">
			{item.id}
		</div>

		<div className="List-row-column u-tableColumnFit u-align-top">
			<PlayerIco id={player.id} align="middle" />
			{item.actor.name}
		</div>

		<div className="List-row-column u-tableColumnFit u-align-top">
			{item.move
				? (
					<React.Fragment>
						{item.move.from} → {item.move.to}
					</React.Fragment>
				)
				: '-'
			}
		</div>

		<div className="List-row-column u-tableColumnFit u-align-top">
			{item.command
				? (
					<React.Fragment>
						<CommandTitle command={item.command.command} />
						{' → '}
						<PlayerIco id={item.command.player} align="middle" />
						{item.command.target.name}
					</React.Fragment>
				)
				: '-'
			}
		</div>

		<div className="List-row-column u-align-top">
			{item.reactions.map(({ command, reactor }, r) => (
				<div key={r}>
					{reactor.name} → <CommandTitle command={command} />
				</div>
			))}
		</div>

		<div className="List-row-column u-align-top">
			{item.results.map((result, r) => (
				<div key={r}>{result}</div>
			))}
		</div>
	</li>
);

class BattleSummaryPage extends React.Component<IProps, IState> {
	public state: IState = {
		record: null
	};

	public componentDidMount(): void {
		const record = Summary.load();
		this.setState({ record });
	}

	public render(): React.ReactNode {
		const { history } = this.props;
		const { record } = this.state;

		if (!record) {
			return (
				<Page heading="Summary">
					<p className="Paragraph">Loading...</p>
				</Page>
			);
		}
		const { chronox, winner } = record;
		const winPlayer = chronox.players.find(pl => winner === pl.id);

		if (!winPlayer) {
			throw new Error('Invalid winner ID: ' + winner);
		}
		const playerData = getPlayerData(chronox);
		const scoreAnalysis = analyzeScore(chronox.timeline, chronox.characters);
		const timeline = chronox.timeline.filter(t => !t.skipped);

		return (
			<Page heading="Summary">
				<h2 className="Heading">
					<PlayerIco id={winner} />
					Player "{winPlayer.name}" won!
				</h2>

				<SummaryPlayers players={playerData} />

				<h2 className="Heading">
					Score
				</h2>

				<ul className="List">
					<li className="List-row List-row--header">
						<div className="List-row-column">
							Top {topListSize} kills
						</div>

						<div className="List-row-column">
							Top {topListSize} damage
						</div>

						<div className="List-row-column">
							Top {topListSize} healing
						</div>
					</li>

					<li className="List-row">
						<div className="List-row-column u-align-top">
							<SummaryScore items={scoreAnalysis.kills} postfix="x" />
						</div>

						<div className="List-row-column u-align-top">
							<SummaryScore items={scoreAnalysis.damage} />
						</div>

						<div className="List-row-column u-align-top">
							<SummaryScore items={scoreAnalysis.healing} />
						</div>
					</li>
				</ul>

				<h2 className="Heading">
					Decisions timeline
				</h2>

				<ul className="List">
					<li className="List-row List-row--header">
						<div className="List-row-column">Nr.</div>
						<div className="List-row-column">Act</div>
						<div className="List-row-column">Actor</div>
						<div className="List-row-column">Move</div>
						<div className="List-row-column">Command</div>
						<div className="List-row-column">Reaction</div>
						<div className="List-row-column">Result</div>
					</li>

					{timeline.map((t, i) => {
						const player = playerData.find(pl => t.player === pl.id);

						if (!player) {
							throw new Error('Invalid Character or Player data');
						}
						const item = getSummaryItem(chronox.characters, t);
						return renderSummaryItem(item, player, i);
					})}
				</ul>

				<Separator />

				<ButtonRow>
					<Button text="Exit" onClick={exit(history)} />
				</ButtonRow>
			</Page>
		);
	}
}

export default withRouter(BattleSummaryPage);
