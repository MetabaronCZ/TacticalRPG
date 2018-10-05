import { SkillElement } from 'engine/skill/skill-data';
import { MagicSkillID } from 'engine/skill/magic';

export type SkillsetID =
	'NONE' | 'PSYCHOKINESIS' |
	'WHITE_MAGIC' | 'BLACK_MAGIC' |
	'FIRE_MAGIC' | 'WATER_MAGIC' |
	'WIND_MAGIC' | 'EARTH_MAGIC' |
	'ICE_MAGIC' | 'THUNDER_MAGIC';

export interface ISkillsetData {
	readonly id: SkillsetID;
	readonly title: string;
	readonly description: string;
	readonly element: SkillElement;
	readonly skills: MagicSkillID[];
}
