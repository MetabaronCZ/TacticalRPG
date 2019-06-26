import { SkillElement } from 'modules/skill/skill-data';

export type Affinity = 'ELEMENTAL_WEAK' | 'ELEMENTAL_NEUTRAL' | 'ELEMENTAL_STRONG';

type IElementAffinityTable = {
	[E in SkillElement]: SkillElement | null;
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
