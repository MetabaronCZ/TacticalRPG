import React from 'react';

import { Icos, IcoID } from 'data/icos';

import Tile from 'modules/geometry/tile';
import { CharacterData } from 'modules/character-creation/character-data';

import ArmorIco from 'ui/common/ArmorIco';
import WeaponIco from 'ui/common/WeaponIco';
import ArchetypeIco from 'ui/common/ArchetypeIco';

export const formatTile = (tile: Tile | null): string => {
	if (!tile) {
		return '-';
	}
	return `(${tile.x}, ${tile.y}, ${tile.z})`;
};

export const formatTiles = (arr: Tile[]): string => `[ ${arr.map(tile => formatTile(tile)).join(', ')} ]`;

export const formatCharacter = (character: CharacterData | null): React.ReactNode => {
	if (!character) {
		return '';
	}
	const { sex, archetype, mainHand, offHand, armor } = character;
	let off: React.ReactNode = '';

	if (character.isDualWielding()) {
		off = <WeaponIco weapon={mainHand.id} minimal />;
	} else {
		off = <WeaponIco weapon={offHand.id} minimal />;
	}
	return (
		<React.Fragment>
			{Icos[sex.id.toLowerCase() as IcoID] || ''}
			{' '}
			<ArchetypeIco archetype={archetype.id} />
			{' '}
			<WeaponIco weapon={mainHand.id} minimal />
			{' '}
			{off}
			{' '}
			<ArmorIco armor={armor.id} minimal />
		</React.Fragment>
	);
};
