import React, { ReactNode } from 'react';

import Link from 'ui/components/Link';
import LinkIco from 'ui/components/LinkIco';
import LinkButton from 'ui/components/LinkButton';

import { IParty } from 'models/party';

type IFun = any;

const renderMoveDown = (party: IParty, onMoveDown: IFun) => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(party.id)} />
);

const renderMoveUp = (party: IParty, onMoveUp: IFun) => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp(party.id)} />
);

const renderEdit = (party: IParty) => (
	<Link href={`/party-edit/${party.id}`}>Edit</Link>
);

const renderDelete = (party: IParty, onDelete: IFun) => (
	<LinkButton onClick={onDelete(party.id, party.name)}>Delete</LinkButton>
);

interface IColumn {
	title: string;
	name: string;
	value: (party: IParty) => ReactNode;
}

const getColumns = (onMoveDown: IFun, onMoveUp: IFun, onDelete: IFun): IColumn[] => ([
	{ title: 'Name', name: 'name', value: (party) => party.name },
	{ title: '', name: 'moveDown', value: (party) => renderMoveDown(party, onMoveDown) },
	{ title: '', name: 'moveUp', value: (party) => renderMoveUp(party, onMoveUp) },
	{ title: '', name: 'edit', value: renderEdit },
	{ title: '', name: 'delete', value: (party) => renderDelete(party, onDelete) }
]);

interface IPartyListProps {
	parties: IParty[];
	onMoveDown: IFun;
	onMoveUp: IFun;
	onDelete: IFun;
}

const PartyList: React.SFC<IPartyListProps> = (props) => {
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
