import { MiscSkillID } from 'modules/skill/misc';
import { MagicSkillID } from 'modules/skill/magic';
import { WeaponSkillID } from 'modules/skill/weapon';
import { DynamicSkillID } from 'modules/skill/dynamic';
import { WeaponID } from 'modules/equipment/weapon-data';
import { StatusEffectID } from 'modules/battle/status-effect';

// fake infinity number
export type Ultimate = 'ULTIMATE';

export type SkillID = MiscSkillID | WeaponSkillID | MagicSkillID | DynamicSkillID;
export type SkillType = 'ACTIVE' | 'REACTIVE' | 'PASSIVE';
export type SkillArea = 'SINGLE' | 'LINE'  | 'NEIGHBOURS' | 'AOE3x3';
export type SkillElement = 'NONE' | 'FIRE' | 'ICE' | 'WIND' | 'EARTH' | 'THUNDER' | 'WATER' | 'DARK' | 'HOLY' | 'PSYCHIC';
export type SkillTarget = 'NONE' | 'ANY' | 'SELF' | 'ALLY' | 'ENEMY';
export type SkillRange = 0 | 1 | 2 | 4 | Ultimate;
export type SkillGrade = 0 | 1 | 2;
export type SkillCooldown = 0 | 1 | 2 | Ultimate;
export type ISkillAnimationDuration = 0 | 150 | 1000;

export interface ISkillAnimation {
	duration: ISkillAnimationDuration;
}

export interface ISkillData {
	readonly title: string;
	readonly apCost?: number;
	readonly mpCost?: number;
	readonly type: SkillType;
	readonly grade?: SkillGrade;
	readonly range: SkillRange;
	readonly area: SkillArea;
	readonly target?: SkillTarget;
	readonly weapon?: WeaponID;
	readonly element?: SkillElement;
	readonly hitScan?: boolean;
	readonly isFixedDamage?: boolean;
	readonly physical: number;
	readonly magical: number;
	readonly block?: number;
	readonly status?: StatusEffectID[];
	readonly cooldown?: SkillCooldown;
	readonly animation: ISkillAnimation;
}
