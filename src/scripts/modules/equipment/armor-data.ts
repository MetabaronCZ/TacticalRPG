import { ArmorSkillID } from 'modules/skill/armor';

export type ArmorID = 'NONE' | 'LIGHT' | 'HEAVY' | 'MAGICAL';

export interface IArmorData {
	readonly id: ArmorID;
	readonly title: string;
	readonly description: string;
	readonly hpBonus?: number;
	readonly mpBonus?: number;
	readonly skills: ArmorSkillID[];
}
