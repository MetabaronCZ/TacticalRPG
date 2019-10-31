export type ElementID = 'FIRE' | 'ICE' | 'WIND' | 'EARTH' | 'THUNDER' | 'WATER' | 'DARK' | 'HOLY' | 'KINETIC';
export type Affinity = 'ELEMENTAL_WEAK' | 'ELEMENTAL_NEUTRAL' | 'ELEMENTAL_STRONG';

type IAffinityTable = {
	readonly [E in ElementID]: ElementID | null;
};

export const AffinityTable: IAffinityTable = {
	FIRE: 'ICE',
	ICE: 'WIND',
	WIND: 'EARTH',
	EARTH: 'THUNDER',
	THUNDER: 'WATER',
	WATER: 'FIRE',
	DARK: 'HOLY',
	HOLY: 'DARK',
	KINETIC: 'KINETIC'
};
