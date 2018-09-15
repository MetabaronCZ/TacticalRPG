import { MagicSkillID } from 'modules/skill/magic/types';
import { WeaponSkillID } from 'modules/skill/weapon/types';
import { ArchetypeSkillID } from 'modules/skill/archetype/types';
import { SkillType, SkillRange, SkillArea, SkillTarget, SkillElement } from 'modules/skill/attributes';

import { StatusEffectID } from 'engine/status-effect';

export type SkillID = ArchetypeSkillID | WeaponSkillID | MagicSkillID;

export interface ISkill {
	readonly title: string;
	readonly cost: number; // AP cost
	readonly type: SkillType;
	readonly range: SkillRange;
	readonly area: SkillArea;
	readonly target: SkillTarget; // character target type
	readonly element: SkillElement; // fire, water, ...
	readonly isFixedPhysicalDamage?: boolean;
	readonly physicalDamage: number; // damage modifier [%]
	readonly elementalDamage: number; // elemental damage modifier [%]
	readonly status: StatusEffectID[]; // status effects added to attack
}
