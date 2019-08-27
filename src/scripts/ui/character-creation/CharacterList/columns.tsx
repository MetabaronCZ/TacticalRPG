import React from 'react';

import Wields from 'data/wields';
import { Icos, IcoID } from 'data/icos';

import { getPath } from 'modules/route';
import { IArmorData } from 'modules/equipment/armor-data';
import { IWeaponData } from 'modules/equipment/weapon-data';
import { CharacterData } from 'modules/character-creation/character-data';

import Link from 'ui/common/Link';
import LinkIco from 'ui/common/LinkIco';
import ArmorIco from 'ui/common/ArmorIco';
import WeaponIco from 'ui/common/WeaponIco';
import LinkButton from 'ui/common/LinkButton';
import ArchetypeIco from 'ui/common/ArchetypeIco';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'ui/character-creation/CharacterList';
import ElementIco from 'ui/common/ElementIco';
import { ArchetypeID } from 'modules/character/archetype';

interface IColumn {
	readonly title?: string;
	readonly name: string;
	readonly value: (char: CharacterData | null, i: number) => React.ReactNode;
	readonly editable?: boolean;
}

const renderArchetypeIco = (archetype: ArchetypeID): React.ReactNode => (
	<ArchetypeIco archetype={archetype} />
);

const renderArchetype = (char: CharacterData): React.ReactNode => (
	<ElementIco element={char.skillset.element} minimal />
);

const renderMoveDown = (char: CharacterData, onMoveDown?: IOnMoveDown): React.ReactNode => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(char)} />
);

const renderMoveUp = (char: CharacterData, onMoveUp?: IOnMoveUp): React.ReactNode => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp && onMoveUp(char)} />
);

const renderEdit = (char: CharacterData): React.ReactNode => (
	<Link href={getPath('CHARACTER_EDIT', char.id)}>Edit</Link>
);

const renderDelete = (char: CharacterData, onDelete?: IOnDelete): React.ReactNode => (
	<LinkButton onClick={onDelete ? onDelete(char) : undefined}>Delete</LinkButton>
);

const renderWeapon = (weapon: IWeaponData): React.ReactNode => (
	<React.Fragment>
		<WeaponIco weapon={weapon.id} />
		{weapon.title}
	</React.Fragment>
);

const renderArmor = (armor: IArmorData): React.ReactNode => (
	<React.Fragment>
		<ArmorIco armor={armor.id} />
		{armor.title}
	</React.Fragment>
);

const renderOffHandBothWield = (weapon: IWeaponData): React.ReactNode => (
	<span className="List-disabled">
		{renderWeapon(weapon)}
	</span>
);

const getColumns = (editable = false, onMoveDown?: IOnMoveDown, onMoveUp?: IOnMoveUp, onDelete?: IOnDelete): IColumn[] => {
	let columns: IColumn[] = [
		{
			name: 'order',
			value: (char, i) => i + 1
		}, {
			name: 'ico',
			value: char => (char ? renderArchetypeIco(char.archetype.id) : '')
		}, {
			name: 'sex',
			value: char => (char ? Icos[char.sex.id.toLowerCase() as IcoID] || '' : '')
		}, {
			title: 'Name',
			name: 'name',
			value: char => (char ? char.name : 'Empty')
		}, {
			name: 'archetypeIco',
			value: char => (char ? renderArchetype(char) : '')
		}, {
			title: 'Archetype',
			name: 'archetype',
			value: char => (char ? char.archetype.title : '')
		}, {
			title: Wields.get('MAIN').title,
			name: 'mainHand',
			value: char => (char ? renderWeapon(char.mainHand) : '')
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
					return renderOffHandBothWield(main);
				} else if (char.isDualWielding()) {
					return renderWeapon(main);
				} else {
					return renderWeapon(off);
				}
			}
		}, {
			title: 'Armor',
			name: 'armor',
			value: char => (char ? renderArmor(char.armor) : '')
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
