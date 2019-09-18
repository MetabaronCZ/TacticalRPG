import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoRoute } from 'core/navigation';

import Skill from 'modules/skill';
import Command from 'modules/battle/command';
import { IRouteParams } from 'modules/route';
import { IActRecord } from 'modules/battle/act';
import { IChronoxRecord } from 'modules/battle/chronox';
import Summary, { ISummary } from 'modules/battle/summary';
import { IPartyData } from 'modules/party-creation/party-data';
import { IPlayerConfig } from 'modules/battle-configuration/player-data';
import { ICharacterData } from 'modules/character-creation/character-data';

import { formatCharacter } from 'ui/format';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import Separator from 'ui/common/Separator';
import ButtonRow from 'ui/common/ButtonRow';
import PlayerIco from 'ui/common/PlayerIco';
import CommandTitle from 'ui/battle/CommandTitle';

const topListSize = 5; // maximum items of diplayed top kills, damage, ...

type IProps = RouteComponentProps<IRouteParams>;

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
	command: React.ReactNode;
	reactions: React.ReactNode[];
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

// return player agnostic character ID
const getActorID = (actorID: string, playerID: number): string => `${actorID}-${playerID}`;

const getPlayerData = (record: IChronoxRecord): IPlayerData[] => {
	const { characters, players, parties } = record;

	return players.map(pl => {
		const party = parties.find(pt => pl.party === pt.id);
	
		const chars = party
			? party.slots.map(sl => characters.find(char => sl === char.id))
			: [];
	
		return {
			id: pl.id,
			player: pl,
			party,
			characters: chars.filter(char => !!char) as ICharacterData[]
		} as IPlayerData;
	});
};

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
		const { title, skills } = commandPhase.command;
		const command = new Command('ATTACK', title, undefined, skills.map(id => new Skill(id)));
		const cmd = <CommandTitle command={command} />;

		if (commandPhase.target) {
			const target = characters.find(char => commandPhase.target === char.id);

			if (!target) {
				throw new Error('Invalid character ID in record command target');
			}
			result.command = (
				<React.Fragment>
					{cmd} → {target.name}
				</React.Fragment>
			);
		} else {
			result.command = cmd;
		}
	}

	for (const reaction of reactionPhase.reactions) {
		const reactor = characters.find(char => reaction.reactor === char.id);

		if (!reactor) {
			throw new Error('Invalid reactor ID in record reaction');
		}
		if (reaction.command) {
			const { title, skills } = reaction.command;
			const command = new Command('REACTION', title, undefined, skills.map(id => new Skill(id)));
			const cmd = <CommandTitle command={command} />;

			result.reactions.push(
				<React.Fragment>
					{reactor.name} → {cmd}
				</React.Fragment>
			);
		}
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
			txt = `Killed (${item.damaged} damage)`;
		}
		result.results.push(txt);
	}
	return result;
};

const analyzeScore = (timeline: IActRecord[], characters: ICharacterData[]): IScoreAnalysis => {
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
		const actorID = getActorID(actor.id, act.player);
		const results = act.combatPhase.results;

		scoreData[actorID] = scoreData[actorID] || {
			name: actor.name,
			player: act.player,
			kills: 0,
			damage: 0,
			healing: 0
		} as IScoreDataItem;

		const data = scoreData[actorID];

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

const renderScoreItem = (items: IScoreItem[], postfix = ''): React.ReactNode => {
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

				<ul className="Layout">
					<li className="Layout-row">
						{playerData.map(data => (
							<div className="Layout-column u-col-1-2" key={data.id}>
								<div className="Paragraph">
									<div>
										<PlayerIco id={data.id} />
										<strong>Player "{data.player.name}"</strong>
									</div>

									<table className="Table">
										<tbody>
											{data.characters.filter(char => !!char).map(char => (
												<tr className="Table-row" key={char.id}>
													<td className="Table-column">
														{char.name}
													</td>

													<td className="Table-column">
														{'\u00A0'}{formatCharacter(char)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						))}
					</li>
				</ul>

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
						<div className="List-row-column">Nr.</div>
						<div className="List-row-column">Act</div>
						<div className="List-row-column">Actor</div>
						<div className="List-row-column">Move</div>
						<div className="List-row-column">Command</div>
						<div className="List-row-column">Reaction</div>
						<div className="List-row-column">Result</div>
					</li>

					{timeline.map((t, i) => {
						const player = playerData[t.player];

						if (!player) {
							throw new Error('Invalid Character or Player data');
						}
						const item = getRowInfo(chronox.characters, t);

						return (
							<li className="List-row" key={t.id}>
								<div className="List-row-column u-tableColumnFit u-align-top u-align-right">
									{i}.
								</div>

								<div className="List-row-column u-tableColumnFit u-align-top u-align-right">
									{item.id}
								</div>

								<div className="List-row-column u-tableColumnFit u-align-top">
									<PlayerIco id={player.id} align="middle" />
									{item.actor.name}
								</div>

								<div className="List-row-column u-tableColumnFit u-align-top">
									{item.move}
								</div>

								<div className="List-row-column u-tableColumnFit u-align-top">
									{item.command}
								</div>

								<div className="List-row-column u-align-top">
									{item.reactions.map((reaction, r) => (
										<div key={r}>{reaction}</div>
									))}
								</div>

								<div className="List-row-column u-align-top">
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
