import React from 'react';
import ArchetypeIco from 'ui/components/ArchetypeIco';
import Link from 'ui/components/Link';
import LinkIco from 'ui/components/LinkIco';
import LinkButton from 'ui/components/LinkButton';

import icos from 'utils/icos';
import Jobs from 'data/jobs';

import { WieldID } from 'models/wield';
import WeaponList from 'data/weapon-list';
import ArmorList from 'data/armor-list';
import { ICharacter } from 'models/character';
import { IWeapon } from 'models/weapon';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'ui/views/ViewCharacterList';

const renderArchetype = (char: ICharacter): JSX.Element => (
	<ArchetypeIco primary={char.primary} secondary={char.secondary} />
);

const renderMoveDown = (char: ICharacter, onMoveDown?: IOnMoveDown): JSX.Element => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(char.id)} />
);

const renderMoveUp = (char: ICharacter, onMoveUp?: IOnMoveUp): JSX.Element => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp && onMoveUp(char.id)} />
);

const renderEdit = (char: ICharacter): JSX.Element => (
	<Link href={`/character-edit/${char.id}`}>Edit</Link>
);

const renderDelete = (char: ICharacter, onDelete?: IOnDelete): JSX.Element => (
	<LinkButton onClick={onDelete ? onDelete(char.id, char.name) : undefined}>Delete</LinkButton>
);

const renderOffHandBothWield = (title: string): JSX.Element => (
	<span className="List-disabled">{title}</span>
);

export interface IColumn {
	title: string;
	name: string;
	value: any;
	editable?: boolean;
}

const getColumns = (editable: boolean = false, onMoveDown?: IOnMoveDown, onMoveUp?: IOnMoveUp, onDelete?: IOnDelete): IColumn[] => {
	let main: IWeapon|undefined;

	const mainValue = (char: ICharacter): string => {
		main = WeaponList.get(char.main);
		return main ? main.title : '';
	};

	const offValue = (char: ICharacter): JSX.Element|string => {
		if (main && ('BAR' !== char.job) && -1 !== main.wield.indexOf(WieldID.BOTH)) {
			return renderOffHandBothWield(main.title);
		} else {
			const off: IWeapon|undefined = WeaponList.get(char.off);
			return off ? off.title : '';
		}
	};

	let columns = [
		{
			title: '',
			name: 'order',
			value: (char: ICharacter, i: number) => i + 1
		}, {
			title: '',
			name: 'archetype',
			value: renderArchetype
		}, {
			title: '',
			name: 'sex',
			value: (char: ICharacter) => icos[char.sex.toLowerCase()]
		}, {
			title: 'Name',
			name: 'name',
			value: (char: ICharacter) => char.name
		}, {
			title: 'Job',
			name: 'job',
			value: (char: ICharacter) => Jobs[char.job].title
		}, {
			title: 'Main hand',
			name: 'mainHand',
			value: mainValue
		}, {
			title: 'Off hand',
			name: 'offHand',
			value: offValue
		}, {
			title: 'Armor',
			name: 'armor',
			value: (char: ICharacter) => {
				const armor = ArmorList.get(char.armor);
				return armor ? armor.title : '';
			}
		}, {
			title: '',
			name: 'moveDown',
			editable: true,
			value: (char: ICharacter) => renderMoveDown(char, onMoveDown)
		}, {
			title: '',
			name: 'moveUp',
			editable: true,
			value: (char: ICharacter) => renderMoveUp(char, onMoveUp)
		}, {
			title: '',
			name: 'edit',
			editable: true,
			value: renderEdit
		}, {
			title: '',
			name: 'delete',
			editable: true,
			value: (char: ICharacter) => renderDelete(char, onDelete)
		}
	];

	if (!editable) {
		columns = columns.filter((col: IColumn) => !col.editable);
	}

	return columns;
};

export default getColumns;
