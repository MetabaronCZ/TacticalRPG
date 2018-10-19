import React from 'react';

import Wields from 'data/wields';
import { Icos, IcoID } from 'data/icos';

import { CharacterData } from 'modules/character-creation/character-data';

import Link from 'ui/common/Link';
import LinkIco from 'ui/common/LinkIco';
import LinkButton from 'ui/common/LinkButton';
import ArchetypeIco from 'ui/common/ArchetypeIco';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'ui/character-creation/CharacterList';

interface IColumn {
	readonly title?: string;
	readonly name: string;
	readonly value: (char: CharacterData|null, i: number) => React.ReactNode;
	readonly editable?: boolean;
}

const renderArchetype = (char: CharacterData) => (
	<ArchetypeIco archetype={char.archetype.id} />
);

const renderMoveDown = (char: CharacterData, onMoveDown?: IOnMoveDown) => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(char)} />
);

const renderMoveUp = (char: CharacterData, onMoveUp?: IOnMoveUp) => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp && onMoveUp(char)} />
);

const renderEdit = (char: CharacterData) => (
	<Link href={`/character-edit/${char.id}`}>Edit</Link>
);

const renderDelete = (char: CharacterData, onDelete?: IOnDelete) => (
	<LinkButton onClick={onDelete ? onDelete(char) : undefined}>Delete</LinkButton>
);

const renderOffHandBothWield = (title: string) => (
	<span className="List-disabled">{title}</span>
);

const getColumns = (editable = false, onMoveDown?: IOnMoveDown, onMoveUp?: IOnMoveUp, onDelete?: IOnDelete): IColumn[] => {
	let columns: IColumn[] = [
		{
			name: 'order',
			value: (char, i) => i + 1
		}, {
			name: 'ico',
			value: char => (char ? renderArchetype(char) : '')
		}, {
			name: 'sex',
			value: char => (char ? Icos[char.sex.id.toLowerCase() as IcoID] : '')
		}, {
			title: 'Name',
			name: 'name',
			value: char => (char ? char.name : 'Empty')
		}, {
			title: 'Archetype',
			name: 'archetype',
			value: char => {
				if (!char) {
					return '';
				}
				return `${char.archetype.title}${char.isMagicType() ? ' (' + char.skillset.title + ')' : ''}`;
			}
		}, {
			title: Wields.get('MAIN').title,
			name: 'mainHand',
			value: char => (char ? char.mainHand.title : '')
		}, {
			title: Wields.get('OFF').title,
			name: 'offHand',
			value: char => {
				if (!char) {
					return '';
				}
				const main = char.mainHand;
				const off = char.offHand;

				if (char.isBothWielding()) {
					return renderOffHandBothWield(main.title);
				} else if (char.isDualWielding()) {
					return main.title;
				} else {
					return off.title;
				}
			}
		}, {
			title: 'Armor',
			name: 'armor',
			value: char => (char ? char.armor.title : '')
		}, {
			name: 'moveDown',
			editable: true,
			value: char => (char ? renderMoveDown(char, onMoveDown) : '')
		}, {
			name: 'moveUp',
			editable: true,
			value: char => (char ? renderMoveUp(char, onMoveUp) : '')
		}, {
			name: 'edit',
			editable: true,
			value: char => (char ? renderEdit(char) : '')
		}, {
			name: 'delete',
			editable: true,
			value: char => (char ? renderDelete(char, onDelete) : '')
		}
	];

	if (!editable) {
		columns = columns.filter(col => !col.editable);
	}

	return columns;
};

export default getColumns;
