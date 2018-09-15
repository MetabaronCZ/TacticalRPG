import React, { ReactNode } from 'react';

import Link from 'ui/common/Link';
import LinkIco from 'ui/common/LinkIco';
import LinkButton from 'ui/common/LinkButton';

import { IParty, IOnMoveDown, IOnMoveUp, IOnDelete } from 'modules/party/types';

const renderMoveDown = (party: IParty, onMoveDown: IOnMoveDown) => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(party.id)} />
);

const renderMoveUp = (party: IParty, onMoveUp: IOnMoveUp) => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp(party.id)} />
);

const renderEdit = (party: IParty) => (
	<Link href={`/party-edit/${party.id}`}>Edit</Link>
);

const renderDelete = (party: IParty, onDelete: IOnDelete) => (
	<LinkButton onClick={onDelete(party)}>Delete</LinkButton>
);

interface IColumn {
	readonly title: string;
	readonly name: string;
	readonly value: (party: IParty) => ReactNode;
}

const getColumns = (onMoveDown: IOnMoveDown, onMoveUp: IOnMoveUp, onDelete: IOnDelete): IColumn[] => ([
	{ title: 'Name', name: 'name', value: party => party.name },
	{ title: '', name: 'moveDown', value: party => renderMoveDown(party, onMoveDown) },
	{ title: '', name: 'moveUp', value: party => renderMoveUp(party, onMoveUp) },
	{ title: '', name: 'edit', value: renderEdit },
	{ title: '', name: 'delete', value: party => renderDelete(party, onDelete) }
]);

interface IPartyListProps {
	readonly parties: IParty[];
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

			{parties.map((party, i) => (
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

export default PartyList;