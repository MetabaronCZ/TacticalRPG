import { letters } from 'core/string';

import Tile from 'modules/geometry/tile';
import { CharacterData } from 'modules/character-creation/character-data';

export const formatTile = (tile: Tile|null) => null !== tile ? `(${letters[tile.x]}, ${tile.y + 1})` : '-';
export const formatTiles = (arr: Tile[]) => `[ ${arr.map(tile => formatTile(tile)).join(', ')} ]`;

export const formatCharacter = (character: CharacterData|null): string => {
	if (!character) {
		return '';
	}
	const { sex, archetype, mainHand, offHand, armor } = character;
	let weapons = '';

	if (character.isBothWielding()) {
		weapons = mainHand.title;
	} else if (character.isDualWielding()) {
		weapons = `${mainHand.title} + ${mainHand.title}`;
	} else {
		weapons = `${mainHand.title} + ${offHand.title}`;
	}
	return `${sex.title} ${archetype.title} | ${weapons} | ${armor.title}`;
};
