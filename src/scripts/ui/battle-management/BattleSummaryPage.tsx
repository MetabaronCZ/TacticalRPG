import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoRoute } from 'core/navigation';
import { IActRecord } from 'modules/battle/act';
import Chronox, { IChronoxRecord } from 'modules/battle/chronox';
import { ICharacterData } from 'modules/character-creation/character-data';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import Separator from 'ui/common/Separator';
import ButtonRow from 'ui/common/ButtonRow';

type IProps = RouteComponentProps<any>;

interface IState {
	record: IChronoxRecord|null;
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
	const { movePhase, actionPhase } = record;

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

	for (const reaction of actionPhase.reactions) {
		const reactor = characters.find(char => reaction.reactor === char.id);

		if (!reactor) {
			throw new Error('Invalid reactor ID in record action');
		}
		result.reactions.push(`${reactor.name} → ${reaction.action}`);
	}

	return result;
};

class BattleSummaryPage extends React.Component<IProps, IState> {
	public state: IState = {
		record: null
	};

	public componentDidMount() {
		const record = Chronox.loadRecord();
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
		const winner = '???';

		return (
			<Page heading="Summary">
				<h2 className="Heading">
					Player "{winner}" won!
				</h2>

				{record.players.map((pl, p) => {
					const party = record.parties.find(pt => pl.party === pt.id);

					const slots = party
						? party.slots.map(sl => record.characters.find(char => sl === char.id))
						: [];

					const characters = slots.map(sl => sl ? sl.name : null).filter(char => null !== char);

					return (
						<div key={p}>
							<div className="Paragraph">
								<strong>Player "{pl.name}" ({pl.control})</strong>
								<br />
								{characters.join(', ')}
							</div>
						</div>
					);
				})}

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

					{record.timeline.map((t, i) => {
						if (t.skipped) {
							return;
						}
						const item = getRowInfo(record.characters, t);

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
