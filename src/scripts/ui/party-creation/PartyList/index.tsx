import React from 'react';
import { observer } from 'mobx-react';

import { IPartyData } from 'modules/party-creation/party-data';
import getColumns from 'ui/party-creation/PartyList/columns';

export type OnMoveDown = (id: string) => () => void;
export type OnMoveUp = (id: string) => () => void;
export type OnDelete = (id: string) => () => void;

interface IPartyListProps {
	readonly parties: IPartyData[];
	readonly onMoveDown: OnMoveDown;
	readonly onMoveUp: OnMoveUp;
	readonly onDelete: OnDelete;
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

			{parties.map(party => (
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
