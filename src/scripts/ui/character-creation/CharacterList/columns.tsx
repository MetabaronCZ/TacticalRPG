import React from 'react';

import Wields from 'data/wields';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import { Icos, IcoID } from 'data/icos';
import Archetypes from 'data/archetypes';

import { getPath } from 'modules/route';
import { IArmorData } from 'modules/equipment/armor-data';
import { IWeaponData } from 'modules/equipment/weapon-data';
import { isBothWielding, isDualWielding, ICharacterData } from 'modules/character-creation/character-data';

import Link from 'ui/common/Link';
import LinkIco from 'ui/common/LinkIco';
import ArmorIco from 'ui/common/ArmorIco';
import WeaponIco from 'ui/common/WeaponIco';
import LinkButton from 'ui/common/LinkButton';
import ElementIco from 'ui/common/ElementIco';
import ArchetypeIco from 'ui/common/ArchetypeIco';
import { ArchetypeID } from 'modules/character/archetype';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'ui/character-creation/CharacterList';

interface IColumn {
	readonly title?: string;
	readonly name: string;
	readonly value: (char: ICharacterData | null, i: number) => React.ReactNode;
	readonly editable?: boolean;
}

const renderArchetypeIco = (archetype: ArchetypeID): React.ReactNode => (
	<ArchetypeIco archetype={archetype} />
);

const renderArchetype = (char: ICharacterData): React.ReactNode => {
	const skillset = Skillsets.get(char.skillset);
	return <ElementIco element={skillset.element} minimal />;
};

const renderMoveDown = (char: ICharacterData, onMoveDown?: IOnMoveDown): React.ReactNode => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(char.id)} />
);

const renderMoveUp = (char: ICharacterData, onMoveUp?: IOnMoveUp): React.ReactNode => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp && onMoveUp(char.id)} />
);

const renderEdit = (char: ICharacterData): React.ReactNode => (
	<Link href={getPath('CHARACTER_EDIT', char.id)}>Edit</Link>
);

const renderDelete = (char: ICharacterData, onDelete?: IOnDelete): React.ReactNode => (
	<LinkButton onClick={onDelete ? onDelete(char.id) : undefined}>Delete</LinkButton>
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
			value: char => (char ? renderArchetypeIco(char.archetype) : '')
		}, {
			name: 'sex',
			value: char => (char ? Icos[char.sex.toLowerCase() as IcoID] || '' : '')
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
			value: char => {
				if (!char) {
					return '';
				}
				const archetype = Archetypes.get(char.archetype);
				return archetype.title;
			}
		}, {
			title: Wields.get('MAIN').title,
			name: 'mainHand',
			value: char => {
				if (!char) {
					return '';
				}
				const mainHand = Weapons.get(char.main);
				return renderWeapon(mainHand);
			}
		}, {
			title: Wields.get('OFF').title,
			name: 'offHand',
			value: char => {
				if (!char) {
					return '';
				}
				const { main, off } = char;
				const mainHand = Weapons.get(main);
				const offHand = Weapons.get(off);

				if (isBothWielding(char)) {
					return renderOffHandBothWield(mainHand);
				} else if (isDualWielding(char)) {
					return renderWeapon(mainHand);
				} else {
					return renderWeapon(offHand);
				}
			}
		}, {
			title: 'Armor',
			name: 'armor',
			value: char => {
				if (!char) {
					return '';
				}
				const armor = Armors.get(char.armor);
				return renderArmor(armor);
			}
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
