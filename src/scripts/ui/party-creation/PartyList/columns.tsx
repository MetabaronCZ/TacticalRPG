import React, { ReactNode } from 'react';

import { getPath } from 'modules/route';
import { IPartyData } from 'modules/party-creation/party-data';

import Link from 'ui/common/Link';
import LinkIco from 'ui/common/LinkIco';
import LinkButton from 'ui/common/LinkButton';
import { OnDelete, OnMoveUp, OnMoveDown } from 'ui/party-creation/PartyList';

const renderMoveDown = (party: IPartyData, onMoveDown: OnMoveDown): React.ReactNode => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(party.id)} />
);

const renderMoveUp = (party: IPartyData, onMoveUp: OnMoveUp): React.ReactNode => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp(party.id)} />
);

const renderEdit = (party: IPartyData): React.ReactNode => (
	<Link href={getPath('PARTY_EDIT', party.id)}>Edit</Link>
);

const renderDelete = (party: IPartyData, onDelete: OnDelete): React.ReactNode => (
	<LinkButton onClick={onDelete(party.id)}>Delete</LinkButton>
);

interface IColumn {
	readonly title: string;
	readonly name: string;
	readonly value: (party: IPartyData) => ReactNode;
}

const getColumns = (onMoveDown: OnMoveDown, onMoveUp: OnMoveUp, onDelete: OnDelete): IColumn[] => ([
	{ title: 'Name', name: 'name', value: party => party.name },
	{ title: '', name: 'moveDown', value: party => renderMoveDown(party, onMoveDown) },
	{ title: '', name: 'moveUp', value: party => renderMoveUp(party, onMoveUp) },
	{ title: '', name: 'edit', value: renderEdit },
	{ title: '', name: 'delete', value: party => renderDelete(party, onDelete) }
]);

export default getColumns;
