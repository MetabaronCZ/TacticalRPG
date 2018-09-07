import { SkillElement } from 'engine/skill';

type IElementAffinityTable = {
	[E in SkillElement]: SkillElement|null;
};

export const ElementAffinityTable: IElementAffinityTable = {
	NONE: null,
	FIRE: 'ICE',
	ICE: 'WIND',
	WIND: 'EARTH',
	EARTH: 'THUNDER',
	THUNDER: 'WATER',
	WATER: 'FIRE',
	DARK: 'HOLY',
	HOLY: 'DARK',
	PSYCHIC: 'PSYCHIC'
};
