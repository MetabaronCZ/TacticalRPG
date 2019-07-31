import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoRoute } from 'core/navigation';

import { IActRecord } from 'modules/battle/act';
import Summary, { ISummary } from 'modules/battle/summary';
import { ICharacterData } from 'modules/character-creation/character-data';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import Separator from 'ui/common/Separator';
import ButtonRow from 'ui/common/ButtonRow';
import PlayerIco from 'ui/common/PlayerIco';
import { IPartyData } from 'modules/party-creation/party-data';
import { IPlayerConfig } from 'modules/battle-configuration/player-data';

const topListSize = 5; // maximum items of diplayed top kills, damage, ...

type IProps = RouteComponentProps<any>;

interface IState {
	record: ISummary | null;
}

const exit = (history: History) => () => {
	gotoRoute(history, 'ROOT');
};

interface IRecordAnalysis {
	readonly id: number;
	readonly actor: ICharacterData;
	readonly skipped: boolean;
	move: string;
	command: string;
	reactions: string[];
	results: string[];
}

interface IScoreData {
	[id: string]: IScoreDataItem;
}

interface IScoreDataItem {
	readonly name: string;
	readonly player: number;
	kills: number;
	damage: number;
	healing: number;
}

interface IScoreItem {
	readonly name: string;
	readonly amount: number;
	readonly player: number;
}

interface IScoreAnalysis {
	kills: IScoreItem[];
	damage: IScoreItem[];
	healing: IScoreItem[];
}

interface IPlayerData {
	readonly id: number;
	readonly party: IPartyData;
	readonly player: IPlayerConfig;
	readonly characters: ICharacterData[];
}

const getRowInfo = (characters: ICharacterData[], record: IActRecord): IRecordAnalysis => {
	const actor = characters.find(char => record.actor === char.id);

	if (!actor) {
		throw new Error('Invalid actor on timeline item ' + record.id);
	}
	const result: IRecordAnalysis = {
		id: record.id,
		actor,
		skipped: record.skipped,
		move: '-',
		command: '-',
		reactions: [],
		results: []
	};

	if (record.skipped) {
		return result;
	}
	const { movementPhase, commandPhase, reactionPhase, combatPhase } = record;

	if (movementPhase.initialPosition !== movementPhase.target) {
		result.move = `${movementPhase.initialPosition} → ${movementPhase.target}`;
	}

	if (commandPhase.command) {
		if (commandPhase.target) {
			const target = characters.find(char => commandPhase.target === char.id);

			if (!target) {
				throw new Error('Invalid character ID in record command target');
			}
			result.command = `${commandPhase.command} → ${target.name}`;
		} else {
			result.command = commandPhase.command;
		}
	}

	for (const reaction of reactionPhase.reactions) {
		const reactor = characters.find(char => reaction.reactor === char.id);

		if (!reactor) {
			throw new Error('Invalid reactor ID in record reaction');
		}
		result.reactions.push(`${reactor.name} → ${reaction.command}`);
	}

	for (const item of combatPhase.results) {
		let txt = '-';

		if (item.evaded) {
			txt = 'Evaded';
		}
		if (item.damaged > 0) {
			txt = item.damaged + ' damage';
		}
		if (item.healed > 0) {
			txt = item.healed + ' healing';
		}
		if (item.revived) {
			txt = 'Revived';
		}
		if (item.killed) {
			txt = 'Killed';
		}
		result.results.push(txt);
	}
	return result;
};

const analyzeScore = (timeline: IActRecord[], characters: ICharacterData[], players: IPlayerData[]): IScoreAnalysis => {
	const result: IScoreAnalysis = {
		kills: [],
		damage: [],
		healing: []
	};
	const scoreData: IScoreData = {};

	// agregate character data from each Act
	for (const act of timeline) {
		const actor = characters.find(ch => act.actor === ch.id);

		if (!actor) {
			throw new Error('Invalid score record character ID');
		}
		const playerData = players.find(pl => pl.characters.find(char => actor.id === char.id));

		if (!playerData) {
			throw new Error('Invalid score record player data');
		}
		const results = act.combatPhase.results;

		scoreData[actor.id] = scoreData[actor.id] || {
			name: actor.name,
			player: playerData.id,
			kills: 0,
			damage: 0,
			healing: 0
		} as IScoreDataItem;

		const data = scoreData[actor.id];

		for (const res of results) {
			data.damage += res.damaged;
			data.healing += res.healed;
			data.kills += (res.killed ? 1 : 0);
		}
	}

	// create result array
	for (const id in scoreData) {
		const { name, player, kills, damage, healing } = scoreData[id];

		if (kills > 0) {
			result.kills.push({ name, player, amount: kills });
		}
		if (damage) {
			result.damage.push({ name, player, amount: damage });
		}
		if (healing) {
			result.healing.push({ name, player, amount: healing });
		}
	}

	result.kills = result.kills
		.sort((a, b) => b.amount - a.amount)
		.slice(0, topListSize);

	result.damage = result.damage
		.sort((a, b) => b.amount - a.amount)
		.slice(0, topListSize);

	result.healing = result.healing
		.sort((a, b) => b.amount - a.amount)
		.slice(0, topListSize);

	return result;
};

const renderScoreItem = (items: IScoreItem[], postfix = '') => {
	if (!items.length) {
		return <React.Fragment />;
	}
	return (
		<table className="Table Table--plain">
			<tbody>
				{items.map((item, i) => (
					<tr key={i}>
						<td className="Table-column">
							{i + 1}.
						</td>

						<td className="Table-column">
							<PlayerIco id={item.player} />
							{item.name}:
						</td>

						<td className="Table-column">
							{item.amount}{postfix}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

class BattleSummaryPage extends React.Component<IProps, IState> {
	public state: IState = {
		record: null
	};

	public componentDidMount() {
		const record = Summary.load();
		this.setState({ record });
	}

	public render() {
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
		const playerData = chronox.players.map(pl => {
			const party = chronox.parties.find(pt => pl.party === pt.id);

			const characters = party
				? party.slots.map(sl => chronox.characters.find(char => sl === char.id))
				: [];

			return {
				id: pl.id,
				player: pl,
				party,
				characters: characters.filter(char => !!char) as ICharacterData[]
			} as IPlayerData;
		});

		const scoreAnalysis = analyzeScore(chronox.timeline, chronox.characters, playerData);

		return (
			<Page heading="Summary">
				<h2 className="Heading">
					<PlayerIco id={winner} />
					Player "{winPlayer.name}" won!
				</h2>

				{playerData.map(data => (
					<div className="Paragraph" key={data.id}>
						<PlayerIco id={data.id} />
						<strong>Player "{data.player.name}"</strong>
						<br />
						{data.characters.map(char => char ? char.name : '?????').join(', ')}
					</div>
				))}

				<h2 className="Heading">
					Score
				</h2>

				<ul className="List">
					<li className="List-row List-row--header">
						<div className="List-row-column">Top kills</div>
						<div className="List-row-column">Top damage</div>
						<div className="List-row-column">Top healing</div>
					</li>

					<li className="List-row">
						<div className="List-row-column u-align-top">
							{renderScoreItem(scoreAnalysis.kills, 'x')}
						</div>

						<div className="List-row-column u-align-top">
							{renderScoreItem(scoreAnalysis.damage)}
						</div>

						<div className="List-row-column u-align-top">
							{renderScoreItem(scoreAnalysis.healing)}
						</div>
					</li>
				</ul>

				<h2 className="Heading">
					Decisions timeline
				</h2>

				<ul className="List">
					<li className="List-row List-row--header">
						<div className="List-row-column">Act</div>
						<div className="List-row-column">Actor</div>
						<div className="List-row-column">Move</div>
						<div className="List-row-column">Command</div>
						<div className="List-row-column">Reaction</div>
						<div className="List-row-column">Result</div>
					</li>

					{chronox.timeline.map(t => {
						if (t.skipped) {
							return;
						}
						const item = getRowInfo(chronox.characters, t);

						const player = playerData.find(data => {
							return !!data.characters.find(char => char && char.id === item.actor.id);
						});

						if (!player) {
							throw new Error('Invalid Character or Player data');
						}
						return (
							<li className="List-row u-align-top" key={t.id}>
								<div className="List-row-column u-tableColumnFit u-align-right">
									{item.id}.
								</div>

								<div className="List-row-column u-tableColumnFit">
									<PlayerIco id={player.id} />
									{item.actor.name}
								</div>

								<div className="List-row-column u-tableColumnFit">
									{item.move}
								</div>

								<div className="List-row-column u-tableColumnFit">
									{item.command}
								</div>

								<div className="List-row-column">
									{item.reactions.map((reaction, r) => (
										<div key={r}>{reaction}</div>
									))}
								</div>

								<div className="List-row-column">
									{item.results.map((result, r) => (
										<div key={r}>{result}</div>
									))}
								</div>
							</li>
						);
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
