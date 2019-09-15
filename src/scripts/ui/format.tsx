import React from 'react';

import { Icos, IcoID } from 'data/icos';

import Tile from 'modules/geometry/tile';
import { ICharacterData, isDualWielding } from 'modules/character-creation/character-data';

import ArmorIco from 'ui/common/ArmorIco';
import WeaponIco from 'ui/common/WeaponIco';
import ArchetypeIco from 'ui/common/ArchetypeIco';

export const formatTile = (tile: Tile | null): string => {
	if (!tile) {
		return '-';
	}
	return `(${tile.x}, ${tile.y}, ${tile.z})`;
};

export const formatTiles = (arr: Tile[]): string => {
	return `[ ${arr.map(tile => formatTile(tile)).join(', ')} ]`;
};

export const formatCharacter = (character: ICharacterData | null): React.ReactNode => {
	if (!character) {
		return '';
	}
	const { sex, archetype, main, off, armor } = character;
	let offA: React.ReactNode = '';

	if (isDualWielding(character)) {
		offA = <WeaponIco weapon={main} minimal />;
	} else {
		offA = <WeaponIco weapon={off} minimal />;
	}
	return (
		<React.Fragment>
			{Icos[sex.toLowerCase() as IcoID] || ''}
			{' '}
			<ArchetypeIco archetype={archetype} />
			{' '}
			<WeaponIco weapon={main} minimal />
			{' '}
			{offA}
			{' '}
			<ArmorIco armor={armor} minimal />
		</React.Fragment>
	);
};
