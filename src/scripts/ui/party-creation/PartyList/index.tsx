import React from 'react';
import { observer } from 'mobx-react';

import IndexableList from 'modules/indexable-list';
import { PartyData } from 'modules/party-creation/party-data';

import getColumns from 'ui/party-creation/PartyList/columns';

export type IOnMoveDown = (id: string) => () => void;
export type IOnMoveUp = (id: string) => () => void;
export type IOnDelete = (id: string) => () => void;

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
				{columns.map(col => (
					<span className="List-row-column" key={col.name}>
						{col.title}
					</span>
				))}
			</li>

			{parties.data.map(party => (
				<li className="List-row" key={party.id}>
					{columns.map(col => (
						<span className={`List-row-column List-row-column--${col.name}`} key={col.name}>
							{col.value(party)}
						</span>
					))}
				</li>
			))}
		</ul>
	);
};

export default observer(PartyList);
