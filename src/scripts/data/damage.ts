import { Affinity } from 'modules/skill/affinity';

export const backAttackModifier = 2;

type AffinityModifierTable = {
	[aff in Affinity]: number
};

export const affinityModifierTable: AffinityModifierTable = {
	ELEMENTAL_NEUTRAL: 1,
	ELEMENTAL_WEAK: 0.5,
	ELEMENTAL_STRONG: 2
};

type AffinityData = {
	[id in Affinity]: {
		title: string;
	};
};

export const affinityData: AffinityData = {
	ELEMENTAL_STRONG: {
		title: 'Strong elemental affinity'
	},
	ELEMENTAL_WEAK: {
		title: 'Weak elemental affinity'
	},
	ELEMENTAL_NEUTRAL: {
		title: 'Neutral elemental affinity'
	}
};
