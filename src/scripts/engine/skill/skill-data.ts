import { MagicSkillID } from 'engine/skill/magic';
import { WeaponSkillID } from 'engine/skill/weapon';
import { StatusEffectID } from 'engine/status-effect';
import { ArchetypeSkillID } from 'engine/skill/archetype';

export type SkillID = ArchetypeSkillID | WeaponSkillID | MagicSkillID;

export type SkillType = 'ACTIVE' | 'REACTIVE' | 'PASSIVE';
export type SkillArea = 'SINGLE' | 'LINE' | 'CROSS' | 'AOE3x3' | 'NEIGHBOURS';
export type SkillElement = 'NONE' | 'FIRE' | 'ICE' | 'WIND' | 'EARTH' | 'THUNDER' | 'WATER' | 'DARK' | 'HOLY' | 'PSYCHIC';
export type SkillTarget = 'NONE' | 'ANY' | 'SELF' | 'ALLY' | 'ENEMY';
export type SkillRange = 0 | 1 | 2 | 4;

export interface ISkillData {
	readonly title: string;
	readonly cost: number;
	readonly type: SkillType;
	readonly range: SkillRange;
	readonly area: SkillArea;
	readonly target?: SkillTarget;
	readonly element?: SkillElement;
	readonly isFixedPhysicalDamage?: boolean;
	readonly physicalDamage?: number;
	readonly elementalDamage?: number;
	readonly status?: StatusEffectID[];
}
