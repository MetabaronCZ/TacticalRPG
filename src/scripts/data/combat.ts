import { Affinity } from 'modules/skill/affinity';

export const backAttackModifier = 1.5;
export const sideBackAttackModifier = 1.25;

export const shockModifier = 1.5;
export const berserkAttackModifier = 1.5;
export const berserkDefenseModifier = 1.5;

type AffinityModifierTable = {
	readonly [aff in Affinity]: number
};

export const affinityModifierTable: AffinityModifierTable = {
	ELEMENTAL_NEUTRAL: 1,
	ELEMENTAL_WEAK: 0.5,
	ELEMENTAL_STRONG: 2
};
