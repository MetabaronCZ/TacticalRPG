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

import { CharacterData } from 'engine/character-data';

const renderArchetype = (char: CharacterData) => (
	<ArchetypeIco archetype={char.getArchetype()} />
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
	<LinkButton onClick={onDelete ? onDelete(char, char.getName()) : undefined}>Delete</LinkButton>
);

const renderOffHandBothWield = (title: string) => (
	<span className="List-disabled">{title}</span>
);

interface IColumn {
	readonly title: string;
	readonly name: string;
	readonly value: (char: CharacterData|null, i: number) => React.ReactNode;
	readonly editable?: boolean;
}

const getColumns = (editable = false, onMoveDown?: IOnMoveDown, onMoveUp?: IOnMoveUp, onDelete?: IOnDelete): IColumn[] => {
	let columns: IColumn[] = [
		{
			title: '',
			name: 'order',
			value: (char, i) => i + 1
		}, {
			title: '',
			name: 'ico',
			value: char => (char ? renderArchetype(char) : '')
		}, {
			title: '',
			name: 'sex',
			value: char => (char ? icos[char.getSex().toLowerCase()] : '')
		}, {
			title: 'Name',
			name: 'name',
			value: char => (char ? char.getName() : 'Empty')
		}, {
			title: 'Archetype',
			name: 'archetype',
			value: char => {
				if (!char) {
					return '';
				}
				const archetype = Archetypes.get(char.getArchetype());
				const skillset = Skillsets.get(char.getSkillset());
				return `${archetype.title}${char.isMagicType() ? ' (' + skillset.title + ')' : ''}`;
			}
		}, {
			title: Wields.get('MAIN').title,
			name: 'mainHand',
			value: char => (char ? Weapons.get(char.getMainHand()).title : '')
		}, {
			title: Wields.get('OFF').title,
			name: 'offHand',
			value: char => {
				if (!char) {
					return '';
				}
				const main = Weapons.get(char.getMainHand());
				const off = Weapons.get(char.getOffHand());

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
			value: char => (char ? Armors.get(char.getArmor()).title : '')
		}, {
			title: '',
			name: 'moveDown',
			editable: true,
			value: char => (char ? renderMoveDown(char, onMoveDown) : '')
		}, {
			title: '',
			name: 'moveUp',
			editable: true,
			value: char => (char ? renderMoveUp(char, onMoveUp) : '')
		}, {
			title: '',
			name: 'edit',
			editable: true,
			value: char => (char ? renderEdit(char) : '')
		}, {
			title: '',
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
