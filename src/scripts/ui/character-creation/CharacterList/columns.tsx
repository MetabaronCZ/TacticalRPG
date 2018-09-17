import React from 'react';

import icos from 'data/icos';
import Wields from 'data/wields';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';

import Link from 'ui/common/Link';
import LinkIco from 'ui/common/LinkIco';
import LinkButton from 'ui/common/LinkButton';
import ArchetypeIco from 'ui/common/ArchetypeIco';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'ui/character-creation/CharacterList';

import { ICharacterData } from 'engine/character-data';
import { isMagicType } from 'engine/utils/character-data';
import { isBothWielding, isDualWielding } from 'engine/utils/equipment';

const renderArchetype = (char: ICharacterData) => (
	<ArchetypeIco archetype={char.archetype} />
);

const renderMoveDown = (char: ICharacterData, onMoveDown?: IOnMoveDown) => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(char)} />
);

const renderMoveUp = (char: ICharacterData, onMoveUp?: IOnMoveUp) => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp && onMoveUp(char)} />
);

const renderEdit = (char: ICharacterData) => (
	<Link href={`/character-edit/${char.id}`}>Edit</Link>
);

const renderDelete = (char: ICharacterData, onDelete?: IOnDelete) => (
	<LinkButton onClick={onDelete ? onDelete(char, char.name) : undefined}>Delete</LinkButton>
);

const renderOffHandBothWield = (title: string) => (
	<span className="List-disabled">{title}</span>
);

interface IColumn {
	readonly title: string;
	readonly name: string;
	readonly value: (char: ICharacterData, i: number) => React.ReactNode;
	readonly editable?: boolean;
}

const getColumns = (editable = false, onMoveDown?: IOnMoveDown, onMoveUp?: IOnMoveUp, onDelete?: IOnDelete): IColumn[] => {
	let columns: IColumn[] = [
		{
			title: '',
			name: 'order',
			value: (char: ICharacterData, i: number) => i + 1
		}, {
			title: '',
			name: 'ico',
			value: renderArchetype
		}, {
			title: '',
			name: 'sex',
			value: (char: ICharacterData) => icos[char.sex.toLowerCase()]
		}, {
			title: 'Name',
			name: 'name',
			value: (char: ICharacterData) => char.name
		}, {
			title: 'Archetype',
			name: 'archetype',
			value: (char: ICharacterData) => {
				const archetype = Archetypes.get(char.archetype);
				const skillset = Skillsets.get(char.skillset);
				return `${archetype.title}${isMagicType(char) ? ' (' + skillset.title + ')' : ''}`;
			}
		}, {
			title: Wields.get('MAIN').title,
			name: 'mainHand',
			value: (char: ICharacterData) => Weapons.get(char.main).title
		}, {
			title: Wields.get('OFF').title,
			name: 'offHand',
			value: (char: ICharacterData) => {
				const main = Weapons.get(char.main);
				const off = Weapons.get(char.off);

				if (isBothWielding(char.main)) {
					return renderOffHandBothWield(main.title);
				} else if (isDualWielding(char.main)) {
					return main.title;
				} else {
					return off.title;
				}
			}
		}, {
			title: 'Armor',
			name: 'armor',
			value: (char: ICharacterData) => Armors.get(char.armor).title
		}, {
			title: '',
			name: 'moveDown',
			editable: true,
			value: (char: ICharacterData) => renderMoveDown(char, onMoveDown)
		}, {
			title: '',
			name: 'moveUp',
			editable: true,
			value: (char: ICharacterData) => renderMoveUp(char, onMoveUp)
		}, {
			title: '',
			name: 'edit',
			editable: true,
			value: renderEdit
		}, {
			title: '',
			name: 'delete',
			editable: true,
			value: (char: ICharacterData) => renderDelete(char, onDelete)
		}
	];

	if (!editable) {
		columns = columns.filter(col => !col.editable);
	}

	return columns;
};

export default getColumns;
