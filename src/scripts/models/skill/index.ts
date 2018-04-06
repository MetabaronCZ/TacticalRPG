export enum SKillType {
	ACTIVE = 'ACTIVE',
	REACTIVE = 'REACTIVE',
	PASSIVE = 'PASSIVE'
}

export enum SKillRange {
	R0 = '0',
	R1 = '1',
	R2 = '2',
	R4 = '4'
}

export enum SKillArea {
	SINGLE = 'SINGLE',
	LINE = 'LINE',
	CONE = 'CONE',
	CROSS = 'CROSS',
	AOE3x3 = 'AOE3x3'
}

export enum SKillElement {
	NONE = 'NONE',
	FIRE = 'FIRE',
	ICE = 'ICE',
	WIND = 'WIND',
	EARTH = 'EARTH',
	THUNDER = 'THUNDER',
	WATER = 'WATER',
	DARK = 'DARK',
	HOLY = 'HOLY',
	PSYCHIC = 'PSYCHIC'
}

export enum SkillStatus {
	CRIPPLE = 'CRIPPLE',
	DISARM = 'DISARM',
	BLEED = 'BLEED',
	STUN = 'STUN',
	BURN = 'BURN',
	SHOCK = 'SHOCK',
	FREEZE = 'FREEZE',
	FORGET = 'FORGET',
	SILENCE = 'SILENCE',

	FLOAT = 'FLOAT',
	REGEN = 'REGEN',
	BERSERK = 'BERSERK',
	IRON_SKIN = 'IRON_SKIN',
	ULTIMATE_DEFENSE = 'ULTIMATE_DEFENSE'
}

export interface ISKill {
	readonly title: string;
	readonly cost: number; // AP cost
	readonly type: SKillType;
	readonly range: SKillRange;
	readonly area: SKillArea;
	readonly isAreaEffect: boolean; // pierces through enemies (takes whole skill area)
	readonly element: SKillElement; // fire, water, ...
	readonly physicalDamage: number; // damage modifier [%]
	readonly elementalDamage: number; // elemental damage modifier [%]
	readonly status: SkillStatus[]; // status effects added to attack
}

const elementAffinityTable = {
	[SKillElement.NONE]: null,
	[SKillElement.FIRE]: SKillElement.ICE,
	[SKillElement.ICE]: SKillElement.WIND,
	[SKillElement.WIND]: SKillElement.EARTH,
	[SKillElement.EARTH]: SKillElement.THUNDER,
	[SKillElement.THUNDER]: SKillElement.WATER,
	[SKillElement.WATER]: SKillElement.FIRE,
	[SKillElement.DARK]: SKillElement.HOLY,
	[SKillElement.HOLY]: SKillElement.DARK,
	[SKillElement.PSYCHIC]: SKillElement.PSYCHIC,
};

export class Skill {
	public static getElementModifier(offensiveElm: SKillElement, defensiveElm: SKillElement): number {
		if (elementAffinityTable[offensiveElm] === defensiveElm) {
			return 2;
		}
		if (elementAffinityTable[defensiveElm] === offensiveElm) {
			return 0.5;
		}
		return 1;
	}
}
