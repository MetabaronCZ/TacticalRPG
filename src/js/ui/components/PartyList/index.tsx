import React from 'react';
import Link from 'ui/components/Link';
import LinkIco from 'ui/components/LinkIco';
import LinkButton from 'ui/components/LinkButton';
import { IParty } from 'models/party';

type IFun = any;

const renderMoveDown = (party: IParty, onMoveDown: IFun): JSX.Element => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(party.id)} />
);

const renderMoveUp = (party: IParty, onMoveUp: IFun): JSX.Element => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp(party.id)} />
);

const renderEdit = (party: IParty): JSX.Element => (
	<Link href={`/party-edit/${party.id}`}>Edit</Link>
);

const renderDelete = (party: IParty, onDelete: IFun): JSX.Element => (
	<LinkButton onClick={onDelete(party.id, party.name)}>Delete</LinkButton>
);

interface IColumn {
	title: string;
	name: string;
	value: (party: IParty) => string|JSX.Element;
}

const getColumns = (onMoveDown: IFun, onMoveUp: IFun, onDelete: IFun): IColumn[] => ([
	{ title: 'Name', name: 'name', value: (party: IParty) => party.name },
	{ title: '', name: 'moveDown', value: (party: IParty) => renderMoveDown(party, onMoveDown) },
	{ title: '', name: 'moveUp', value: (party: IParty) => renderMoveUp(party, onMoveUp) },
	{ title: '', name: 'edit', value: renderEdit },
	{ title: '', name: 'delete', value: (party: IParty) => renderDelete(party, onDelete) }
]);

interface IPartyListProps {
	parties: IParty[];
	onMoveDown: IFun;
	onMoveUp: IFun;
	onDelete: IFun;
}

const PartyList = ({ parties, onMoveDown, onMoveUp, onDelete }: IPartyListProps): JSX.Element => {
	const columns: IColumn[] = getColumns(onMoveDown, onMoveUp, onDelete);

	return (
		<ul className="List">
			<li className="List-row List-row--header">
				{columns.map((col: IColumn, i: number) => (
					<span className="List-row-column" key={i}>
						{col.title}
					</span>
				))}
			</li>

			{parties.map((party: IParty, i: number) => {
				return (
					<li className="List-row" key={i}>
						{columns.map((col: IColumn, j: number) => (
							<span className={`List-row-column List-row-column--${col.name}`} key={j}>
								{col.value(party)}
							</span>
						))}
					</li>
				);
			})}
		</ul>
	);
};

export default PartyList;
