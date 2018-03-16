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
	SINGLE = 'SINGLE'
}

export enum SkillUsage {
	ATTACK = 'ATTACK',
	SPECIAL = 'SPECIAL',
}

export interface ISKill {
	readonly title: string;
	readonly type: SKillType;
	readonly range: SKillRange;
	readonly area: SKillArea;
	readonly usage: SkillUsage;
}

export class Skill {
	/* */
}
