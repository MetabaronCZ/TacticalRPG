import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoRoute } from 'core/navigation';

import { IActRecord } from 'modules/battle/act';
import Summary, { ISummary, IScoreRecord } from 'modules/battle/summary';
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
	id: number;
	actor: ICharacterData;
	skipped: boolean;
	move: string;
	action: string;
	reactions: string[];
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
		action: '-',
		reactions: []
	};

	if (record.skipped) {
		return result;
	}
	const { movementPhase: movePhase, actionPhase, reactionPhase } = record;

	if (movePhase.initialPosition !== movePhase.target) {
		result.move = `${movePhase.initialPosition} → ${movePhase.target}`;
	}

	if (null !== actionPhase.action) {
		if (null !== actionPhase.target) {
			const target = characters.find(char => actionPhase.target === char.id);

			if (!target) {
				throw new Error('Invalid character ID in record action target');
			}
			result.action = `${actionPhase.action} → ${target.name}`;
		} else {
			result.action = actionPhase.action;
		}
	}

	for (const reaction of reactionPhase.reactions) {
		const reactor = characters.find(char => reaction.reactor === char.id);

		if (!reactor) {
			throw new Error('Invalid reactor ID in record action');
		}
		result.reactions.push(`${reactor.name} → ${reaction.action}`);
	}

	return result;
};

const analyzeScore = (score: IScoreRecord, characters: ICharacterData[]): IScoreAnalysis => {
	const result: IScoreAnalysis = {
		kills: [],
		damage: [],
		healing: []
	};
	for (const id in score) {
		const char = characters.find(ch => id === ch.id);
		const data = score[id];

		if (!char) {
			throw new Error('Invalid score record character ID');
		}
		if (data.kills > 0) {
			result.kills.push({ name: char.name, amount: data.kills });
		}
		if (data.damage > 0) {
			result.damage.push({ name: char.name, amount: data.damage });
		}
		if (data.healing > 0) {
			result.healing.push({ name: char.name, amount: data.healing });
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
		const { chronox, score, winner } = record;
		const winPlayer = chronox.players[winner].name;
		const scoreAnalysis = analyzeScore(score, chronox.characters);

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
						<div className="List-row-column">Action</div>
						<div className="List-row-column">Reaction/s</div>
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
									{item.action}
								</div>

								<div className="List-row-column">
									{item.reactions.length ? item.reactions.join(', ') : '-'}
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
