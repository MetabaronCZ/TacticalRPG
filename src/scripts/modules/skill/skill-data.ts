import { MagicSkillID } from 'modules/skill/magic';
import { WeaponSkillID } from 'modules/skill/weapon';
import { MiscSkillID } from 'modules/skill/misc';
import { StatusEffectID } from 'modules/battle/status-effect';

// fake infinity number
export type Ultimate = 'ULTIMATE';

export type SkillID = MiscSkillID | WeaponSkillID | MagicSkillID;
export type SkillType = 'ACTIVE' | 'REACTIVE' | 'PASSIVE';
export type SkillArea = 'SINGLE' | 'LINE' | 'CROSS' | 'AOE3x3' | 'NEIGHBOURS';
export type SkillElement = 'NONE' | 'FIRE' | 'ICE' | 'WIND' | 'EARTH' | 'THUNDER' | 'WATER' | 'DARK' | 'HOLY' | 'PSYCHIC';
export type SkillTarget = 'NONE' | 'ANY' | 'SELF' | 'ALLY' | 'ENEMY';
export type SkillRange = 0 | 1 | 2 | 4 | Ultimate;
export type SkillGrade = 0 | 1 | 2;
export type SkillCooldown = 0 | 1 | 2 | Ultimate;

export interface ISkillData {
	readonly title: string;
	readonly cost: number;
	readonly type: SkillType;
	readonly grade?: SkillGrade;
	readonly range: SkillRange;
	readonly area: SkillArea;
	readonly target?: SkillTarget;
	readonly element?: SkillElement;
	readonly isFixedPhysicalDamage?: boolean;
	readonly physicalDamage?: number;
	readonly magicalDamage?: number;
	readonly status?: StatusEffectID[];
	readonly cooldown?: SkillCooldown;
}
