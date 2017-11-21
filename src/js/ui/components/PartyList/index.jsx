import React from 'react';
import Link from 'ui/components/Link';
import LinkIco from 'ui/components/LinkIco';
import LinkButton from 'ui/components/LinkButton';

const renderMoveDown = (party, onMoveDown) => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown(party.id)} />
);

const renderMoveUp = (party, onMoveUp) => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp(party.id)} />
);

const renderEdit = party => (
	<Link href={`/party-edit/${party.id}`}>Edit</Link>
);

const renderDelete = (party, onDelete) => (
	<LinkButton onClick={onDelete(party.id, party.name)}>Delete</LinkButton>
);

const getColumns = (onMoveDown, onMoveUp, onDelete) => ([
	{ title: 'Name', name: 'name', value: party => party.name },
	{ title: '', name: 'moveDown', value: party => renderMoveDown(party, onMoveDown) },
	{ title: '', name: 'moveUp', value: party => renderMoveUp(party, onMoveUp) },
	{ title: '', name: 'edit', value: renderEdit },
	{ title: '', name: 'delete', value: party => renderDelete(party, onDelete) }
]);

const PartyList = ({ parties, onMoveDown, onMoveUp, onDelete }) => {
	let columns = getColumns(onMoveDown, onMoveUp, onDelete);

	return (
		<ul className="List">
			<li className="List-row List-row--header">
				{columns.map((col, i) => (
					<span className="List-row-column" key={i}>
						{col.title}
					</span>
				))}
			</li>

			{parties.map((party, i) => {
				return (
					<li className="List-row" key={i}>
						{columns.map((col, j) => (
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
