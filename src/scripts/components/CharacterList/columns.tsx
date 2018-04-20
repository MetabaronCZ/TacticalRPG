import React from 'react';

import icos from 'data/icos';

import Link from 'components/Link';
import LinkIco from 'components/LinkIco';
import LinkButton from 'components/LinkButton';
import ArchetypeIco from 'components/ArchetypeIco';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'pages/ViewCharacterList';

import { Jobs } from 'models/job';
import { Armors } from 'models/armor';
import { Weapons } from 'models/weapon';
import { CharacterData, ICharacterData } from 'models/character-data';

const renderArchetype = (char: ICharacterData) => (
	<ArchetypeIco primary={char.primary} secondary={char.secondary} />
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

export interface IColumn {
	title: string;
	name: string;
	value: any;
	editable?: boolean;
}

const getColumns = (editable: boolean = false, onMoveDown?: IOnMoveDown, onMoveUp?: IOnMoveUp, onDelete?: IOnDelete): IColumn[] => {
	const mainValue = (char: ICharacterData): string => {
		const main = Weapons.get(char.main);
		return main ? main.title : '';
	};

	const offValue = (char: ICharacterData) => {
		const main = Weapons.get(char.main);
		const off = Weapons.get(char.off);

		if (CharacterData.isBothWielding(char)) {
			return renderOffHandBothWield(main.title);
		} else if (CharacterData.isDualWielding(char)) {
			return main ? main.title : '';
		} else {
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
		columns = columns.filter(col => !col.editable);
	}

	return columns;
};

export default getColumns;
