import { Affinity } from 'modules/skill/affinity';

export const anglePrecision = 10 ** 10; // angle precision modifier
export const backAttackAngle = Math.PI / 6; // 30 degrees
export const sideBackAttackAngle = Math.PI / 3; // 60 degrees

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
