import Position from 'modules/geometry/position';
import { CharacterData } from 'modules/character-creation/character-data';

export const formatPosition = (pos: Position|null) => null !== pos ? `(${pos.x}, ${pos.y})` : '-';
export const formatPositions = (arr: Position[]) => `[ ${arr.map(pos => formatPosition(pos)).join(', ')} ]`;

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
