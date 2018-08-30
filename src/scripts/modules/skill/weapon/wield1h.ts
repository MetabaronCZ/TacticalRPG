import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';
import { WeaponSkillID, IWield1HWeaponSkillList } from 'modules/skill/weapon/types';
import { StatusEffectID } from 'modules/status-effect/types';

const wield1HSkills: IWield1HWeaponSkillList = {
	[WeaponSkillID.SWORD_1H_ATTACK]: {
		title: 'Attack',
		cost: 1,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.SWORD_1H_BLEED]: {
		title: 'Bleed',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [StatusEffectID.BLEED]
	},
	[WeaponSkillID.AXE_1H_ATTACK]: {
		title: 'Attack',
		cost: 1,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.AXE_1H_SMASH]: {
		title: 'Smash',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1.5,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.HAMMER_1H_ATTACK]: {
		title: 'Attack',
		cost: 1,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.HAMMER_1H_STUN]: {
		title: 'Stun',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [StatusEffectID.STUN]
	}
};

export default wield1HSkills;
