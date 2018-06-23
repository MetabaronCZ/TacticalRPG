import { MagicSkillID } from 'modules/skill/magic/types';

export enum SkillsetID {
	NONE = 'NONE',
	PSYCHOKINESIS = 'PSYCHOKINESIS',
	WHITE_MAGIC = 'WHITE_MAGIC',
	BLACK_MAGIC = 'BLACK_MAGIC',
	FIRE_MAGIC = 'FIRE_MAGIC',
	WATER_MAGIC = 'WATER_MAGIC',
	WIND_MAGIC = 'WIND_MAGIC',
	EARTH_MAGIC = 'EARTH_MAGIC',
	ICE_MAGIC = 'ICE_MAGIC',
	THUNDER_MAGIC = 'THUNDER_MAGIC'
}

export interface ISkillset {
	readonly title: string;
	readonly description: string;
	readonly skills: MagicSkillID[];
}
