import React from 'react';
import { observer } from 'mobx-react';

import IndexableList from 'modules/indexable-list';
import { PartyData } from 'modules/party-creation/party-data';

import getColumns from 'ui/party-creation/PartyList/columns';

export type IOnMoveDown = (party: PartyData) => () => void;
export type IOnMoveUp = (party: PartyData) => () => void;
export type IOnDelete = (party: PartyData) => () => void;

interface IPartyListProps {
	readonly parties: IndexableList<PartyData>;
	readonly onMoveDown: IOnMoveDown;
	readonly onMoveUp: IOnMoveUp;
	readonly onDelete: IOnDelete;
}

const PartyList: React.SFC<IPartyListProps> = props => {
	const { parties, onMoveDown, onMoveUp, onDelete } = props;
	const columns = getColumns(onMoveDown, onMoveUp, onDelete);

	return (
		<ul className="List">
			<li className="List-row List-row--header">
				{columns.map((col, i) => (
					<span className="List-row-column" key={i}>
						{col.title}
					</span>
				))}
			</li>

			{parties.data.map((party, i) => (
				<li className="List-row" key={i}>
					{columns.map((col, j) => (
						<span className={`List-row-column List-row-column--${col.name}`} key={j}>
							{col.value(party)}
						</span>
					))}
				</li>
			))}
		</ul>
	);
};

export default observer(PartyList);
