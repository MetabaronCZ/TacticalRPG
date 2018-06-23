import { SkillType, SkillRange, SkillArea, SkillTarget, SkillElement, SkillStatus } from 'modules/skill/attributes';

export interface ISkill {
	readonly title: string;
	readonly cost: number; // AP cost
	readonly type: SkillType;
	readonly range: SkillRange;
	readonly area: SkillArea;
	readonly target: SkillTarget; // character target type
	readonly isAreaEffect: boolean; // pierces through enemies (takes whole skill area)
	readonly element: SkillElement; // fire, water, ...
	readonly physicalDamage: number; // damage modifier [%]
	readonly elementalDamage: number; // elemental damage modifier [%]
	readonly status: SkillStatus[]; // status effects added to attack
}
