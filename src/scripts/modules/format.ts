import { letters } from 'core/string';

import Tile from 'modules/geometry/tile';
import Skillset from 'modules/character/skillset';
import { SkillGrade } from 'modules/skill/skill-data';
import { CharacterData } from 'modules/character-creation/character-data';

const skillsetGradeTable: { [grade in SkillGrade]: string; } = {
	0: '',
	1: 'I',
	2: 'II'
};

export const formatTile = (tile: Tile|null) => {
	if (null === tile) {
		return '-';
	}
	return `(${letters[tile.x]}, ${tile.y + 1})`;
};

export const formatTiles = (arr: Tile[]) => `[ ${arr.map(tile => formatTile(tile)).join(', ')} ]`;

export const formatSkillset = (skillset: Skillset) => {
	const grade = skillsetGradeTable[skillset.grade];
	return skillset.title + (grade ? ' ' + grade : '');
};

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
