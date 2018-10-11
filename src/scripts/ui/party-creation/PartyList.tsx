import React, { ReactNode } from 'react';
import { observer } from 'mobx-react';

import IndexableList from 'engine/indexable-list';
import { PartyData } from 'engine/party-creation/party-data';

import Link from 'ui/common/Link';
import LinkIco from 'ui/common/LinkIco';
import LinkButton from 'ui/common/LinkButton';

export type IOnMoveDown = (party: PartyData) => () => void;
export type IOnMoveUp = (party: PartyData) => () => void;
export type IOnDelete = (party: PartyData) => () => void;

const renderMoveDown = (party: PartyData, onMoveDown: IOnMoveDown) => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(party)} />
);

const renderMoveUp = (party: PartyData, onMoveUp: IOnMoveUp) => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp(party)} />
);

const renderEdit = (party: PartyData) => (
	<Link href={`/party-edit/${party.id}`}>Edit</Link>
);

const renderDelete = (party: PartyData, onDelete: IOnDelete) => (
	<LinkButton onClick={onDelete(party)}>Delete</LinkButton>
);

interface IColumn {
	readonly title: string;
	readonly name: string;
	readonly value: (party: PartyData) => ReactNode;
}

const getColumns = (onMoveDown: IOnMoveDown, onMoveUp: IOnMoveUp, onDelete: IOnDelete): IColumn[] => ([
	{ title: 'Name', name: 'name', value: party => party.getName() },
	{ title: '', name: 'moveDown', value: party => renderMoveDown(party, onMoveDown) },
	{ title: '', name: 'moveUp', value: party => renderMoveUp(party, onMoveUp) },
	{ title: '', name: 'edit', value: renderEdit },
	{ title: '', name: 'delete', value: party => renderDelete(party, onDelete) }
]);

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
