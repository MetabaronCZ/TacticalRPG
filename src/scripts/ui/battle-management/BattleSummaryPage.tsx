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
	kills: number;
	damage: number;
	healing: number;
}

interface IScoreItem {
	readonly name: string;
	readonly amount: number;
}

interface IScoreAnalysis {
	kills: IScoreItem[];
	damage: IScoreItem[];
	healing: IScoreItem[];
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
		let txt = '';

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
		if (txt) {
			result.results.push(txt);
		}
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
		const results = act.combatPhase.results;

		scoreData[actor.id] = scoreData[actor.id] || {
			name: actor.name,
			kills: 0,
			damage: 0,
			healing: 0
		};
		const data = scoreData[actor.id];

		for (const res of results) {
			data.damage += res.damaged;
			data.healing += res.healed;
			data.kills += (res.killed ? 1 : 0);
		}
	}

	// create result array
	for (const id in scoreData) {
		const { name, kills, damage, healing } = scoreData[id];
		result.kills.push({ name, amount: kills });
		result.damage.push({ name, amount: damage });
		result.healing.push({ name, amount: healing });
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
		const winPlayer = chronox.players[winner].name;
		const scoreAnalysis = analyzeScore(chronox.timeline, chronox.characters);

		return (
			<Page heading="Summary">
				<h2 className="Heading">
					Player "{winPlayer}" won!
				</h2>

				{chronox.players.map((pl, p) => {
					const party = chronox.parties.find(pt => pl.party === pt.id);

					const slots = party
						? party.slots.map(sl => chronox.characters.find(char => sl === char.id))
						: [];

					const characters = slots.map(sl => sl ? sl.name : null).filter(char => null !== char);

					return (
						<div className="Paragraph" key={p}>
							<strong>Player "{pl.name}"</strong>
							<br />
							{characters.join(', ')}
						</div>
					);
				})}

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
						<div className="List-row-column">
							{scoreAnalysis.kills.map((item, i) => (
								<div key={i}>{i + 1}. {item.name}: {item.amount}x</div>
							))}
						</div>

						<div className="List-row-column">
							{scoreAnalysis.damage.map((item, i) => (
								<div key={i}>{i + 1}. {item.name}: {item.amount}</div>
							))}
						</div>

						<div className="List-row-column">
							{scoreAnalysis.healing.map((item, i) => (
								<div key={i}>{i + 1}. {item.name}: {item.amount}</div>
							))}
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

					{chronox.timeline.map((t, i) => {
						if (t.skipped) {
							return;
						}
						const item = getRowInfo(chronox.characters, t);

						return (
							<li className="List-row u-align-top" key={i}>
								<div className="List-row-column u-tableColumnFit">
									{item.id}.
								</div>

								<div className="List-row-column u-tableColumnFit">
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
