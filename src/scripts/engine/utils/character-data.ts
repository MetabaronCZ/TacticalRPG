import * as ArrayUtils from 'core/array';

import Sexes from 'data/sexes';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';

import { CharacterData } from 'engine/character-data';

// returns random character properties
export const getRandomCharacterData = (name: string): CharacterData => {
	const character = new CharacterData({
		name,
		sex: Sexes.getRandomID(),
		archetype: Archetypes.getRandomID(),
		skillset: 'NONE'
	});

	if (character.isMagicType()) {
		const skillset = ArrayUtils.getRandomItem(Skillsets.keys());
		character.setSkillset(skillset);
	}
	const mainHands = character.filterWeapons('MAIN', id => id !== 'NONE');
	const mainHand = ArrayUtils.getRandomItem(mainHands);
	character.setMainHand(mainHand);

	if (!character.isBothWielding() && !character.isDualWielding()) {
		const offHands = character.filterWeapons('OFF', id => id !== 'NONE');
		const offHand = ArrayUtils.getRandomItem(offHands);
		character.setOffHand(offHand || 'NONE');

	} else {
		character.setOffHand('NONE');
	}
	const armors = character.filterArmors(id => id !== 'NONE');
	const armor = ArrayUtils.getRandomItem(armors);
	character.setArmor(armor || 'NONE');

	return character;
};
