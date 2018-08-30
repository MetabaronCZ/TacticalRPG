import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';
import { WeaponSkillID, ISmallWeaponSkillList } from 'modules/skill/weapon/types';
import { StatusEffectID } from 'modules/status-effect/types';

const smallSkills: ISmallWeaponSkillList = {
	[WeaponSkillID.FISTS_ATTACK]: {
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
	[WeaponSkillID.FISTS_DISARM]: {
		title: 'Disarm',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [StatusEffectID.DISARM]
	},
	[WeaponSkillID.DAGGER_ATTACK]: {
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
	[WeaponSkillID.DAGGER_STAB]: {
		title: 'Stab',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 2,
		elementalDamage: 0,
		status: []
	}
};

export default smallSkills;
