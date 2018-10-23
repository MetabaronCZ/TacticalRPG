import React, { ReactNode } from 'react';

import { PartyData } from 'modules/party-creation/party-data';

import Link from 'ui/common/Link';
import LinkIco from 'ui/common/LinkIco';
import LinkButton from 'ui/common/LinkButton';
import { IOnDelete, IOnMoveUp, IOnMoveDown } from 'ui/party-creation/PartyList';

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
	{ title: 'Name', name: 'name', value: party => party.name },
	{ title: '', name: 'moveDown', value: party => renderMoveDown(party, onMoveDown) },
	{ title: '', name: 'moveUp', value: party => renderMoveUp(party, onMoveUp) },
	{ title: '', name: 'edit', value: renderEdit },
	{ title: '', name: 'delete', value: party => renderDelete(party, onDelete) }
]);

export default getColumns;
