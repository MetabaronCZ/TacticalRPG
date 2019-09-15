import React, { ReactNode } from 'react';

import { getPath } from 'modules/route';
import { PartyData } from 'modules/party-creation/party-data';

import Link from 'ui/common/Link';
import LinkIco from 'ui/common/LinkIco';
import LinkButton from 'ui/common/LinkButton';
import { IOnDelete, IOnMoveUp, IOnMoveDown } from 'ui/party-creation/PartyList';

const renderMoveDown = (party: PartyData, onMoveDown: IOnMoveDown): React.ReactNode => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(party.id)} />
);

const renderMoveUp = (party: PartyData, onMoveUp: IOnMoveUp): React.ReactNode => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp(party.id)} />
);

const renderEdit = (party: PartyData): React.ReactNode => (
	<Link href={getPath('PARTY_EDIT', party.id)}>Edit</Link>
);

const renderDelete = (party: PartyData, onDelete: IOnDelete): React.ReactNode => (
	<LinkButton onClick={onDelete(party.id)}>Delete</LinkButton>
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
