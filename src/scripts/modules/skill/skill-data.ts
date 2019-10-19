import { ElementID } from 'modules/skill/affinity';
import { WeaponID } from 'modules/equipment/weapon-data';
import { StatusEffectID } from 'modules/battle/status-effect';

import { MiscSkillID } from 'modules/skill/misc';
import { MagicSkillID } from 'modules/skill/magic';
import { ArmorSkillID } from 'modules/skill/armor';
import { WeaponSkillID } from 'modules/skill/weapon';
import { DynamicSkillID } from 'modules/skill/dynamic';

// fake infinity number
export type Ultimate = 'ULTIMATE';

export type SkillID = WeaponSkillID | MagicSkillID | ArmorSkillID | DynamicSkillID | MiscSkillID;
export type SkillType = 'ACTIVE' | 'REACTIVE';
export type SkillArea = 'SINGLE' | 'LINE'  | 'NEIGHBOURS' | 'AOE3x3';
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
	readonly type: SkillType;
	readonly grade?: SkillGrade;

	readonly range: SkillRange;
	readonly area: SkillArea;
	readonly target?: SkillTarget;
	readonly piercing?: boolean;

	readonly status?: StatusEffectID[];
	readonly cooldown?: SkillCooldown;
	readonly animation: ISkillAnimation;

	readonly cost: {
		readonly AP?: number;
		readonly MP?: number;
	};

	readonly physical?: {
		readonly modifier: number;
		readonly weapon: WeaponID;
	};

	readonly magical?: {
		readonly modifier: number;
		readonly element: ElementID;
	};

	readonly healing?: {
		readonly modifier: number;
	};

	readonly block?: {
		readonly modifier: number;
		readonly weapon: WeaponID;
	};
}
