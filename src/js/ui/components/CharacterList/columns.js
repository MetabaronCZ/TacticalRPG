import React from 'react';
import ArchetypeIco from 'ui/components/ArchetypeIco';
import Link from 'ui/components/Link';
import LinkIco from 'ui/components/LinkIco';
import LinkButton from 'ui/components/LinkButton';

import icos from 'utils/icos';
import Jobs from 'data/jobs';

import { WieldID } from 'models/wield';
import Weapons from 'data/weapons';
import Armors from 'data/armor';

const renderArchetype = char => (
	<ArchetypeIco primary={char.primary} secondary={char.secondary} />
);

const renderMoveDown = (char, onMoveDown) => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown(char.id)} />
);

const renderMoveUp = (char, onMoveUp) => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp(char.id)} />
);

const renderEdit = char => (
	<Link href={`/character-edit/${char.id}`}>Edit</Link>
);

const renderDelete = (char, onDelete) => (
	<LinkButton onClick={onDelete(char.id, char.name)}>Delete</LinkButton>
);

const renderOffHandBothWield = title => (
	<span className="List-disabled">{title}</span>
);

const getColumns = (editable, onMoveDown, onMoveUp, onDelete) => {
	let main;

	let mainValue = char => {
		main = Weapons[char.main];
		return Weapons[char.main].title;
	};

	let offValue = char => {
		if ( main && ('BAR' !== char.job) && main.wield.includes(WieldID.BOTH) ){
			return renderOffHandBothWield(main.title);
		} else {
			return Weapons[char.off].title;
		}
	};

	let columns = [
		{ title: '', name: 'order', value: (char, i) => i + 1 },
		{ title: '', name: 'archetype', value: renderArchetype },
		{ title: '', name: 'sex', value: char => icos[char.sex.toLowerCase()] },
		{ title: 'Name', name: 'name', value: char => char.name },
		{ title: 'Job', name: 'job', value: char => Jobs[char.job].title },
		{ title: 'Main hand', name: 'mainHand', value: mainValue },
		{ title: 'Off hand', name: 'offHand', value: offValue },
		{ title: 'Armor', name: 'armor', value: char => Armors.get(char.armor).title },
		{ title: '', name: 'moveDown', editable: true, value: char => renderMoveDown(char, onMoveDown) },
		{ title: '', name: 'moveUp', editable: true, value: char => renderMoveUp(char, onMoveUp) },
		{ title: '', name: 'edit', editable: true, value: renderEdit },
		{ title: '', name: 'delete', editable: true, value: char => renderDelete(char, onDelete) }
	];

	if ( !editable ){
		columns = columns.filter(col => !col.editable);
	}

	return columns;
};

export default getColumns;
