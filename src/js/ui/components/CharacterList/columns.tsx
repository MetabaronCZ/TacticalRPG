import React from 'react';

import icos from 'data/icos';

import Link from 'ui/components/Link';
import LinkIco from 'ui/components/LinkIco';
import LinkButton from 'ui/components/LinkButton';
import ArchetypeIco from 'ui/components/ArchetypeIco';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'ui/views/ViewCharacterList';

import { Jobs } from 'models/job';
import { Armors } from 'models/armor';
import { WieldID } from 'models/wield';
import { ICharacterData } from 'models/character';
import { IWeaponData, Weapons } from 'models/weapon';

const renderArchetype = (char: ICharacterData): JSX.Element => (
	<ArchetypeIco primary={char.primary} secondary={char.secondary} />
);

const renderMoveDown = (char: ICharacterData, onMoveDown?: IOnMoveDown): JSX.Element => (
	<LinkIco ico="down" title="Move down" onClick={onMoveDown && onMoveDown(char.id)} />
);

const renderMoveUp = (char: ICharacterData, onMoveUp?: IOnMoveUp): JSX.Element => (
	<LinkIco ico="up" title="Move up" onClick={onMoveUp && onMoveUp(char.id)} />
);

const renderEdit = (char: ICharacterData): JSX.Element => (
	<Link href={`/character-edit/${char.id}`}>Edit</Link>
);

const renderDelete = (char: ICharacterData, onDelete?: IOnDelete): JSX.Element => (
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
	let main: IWeaponData|undefined;

	const mainValue = (char: ICharacterData): string => {
		main = Weapons.get(char.main);
		return main ? main.title : '';
	};

	const offValue = (char: ICharacterData): JSX.Element|string => {
		if (main && ('BAR' !== char.job) && -1 !== main.wield.indexOf(WieldID.BOTH)) {
			return renderOffHandBothWield(main.title);
		} else {
			const off = Weapons.get(char.off);
			return off ? off.title : '';
		}
	};

	let columns: IColumn[] = [
		{
			title: '',
			name: 'order',
			value: (char: ICharacterData, i: number) => i + 1
		}, {
			title: '',
			name: 'archetype',
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
			title: 'Job',
			name: 'job',
			value: (char: ICharacterData) => {
				const job = Jobs.get(char.job);
				return job ? job.title : '';
			}
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
			value: (char: ICharacterData) => {
				const armor = Armors.get(char.armor);
				return armor ? armor.title : '';
			}
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
		columns = columns.filter((col) => !col.editable);
	}

	return columns;
};

export default getColumns;