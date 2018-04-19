import { WeaponSkillID } from 'models/skill/weapon/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillStatus, SkillTarget } from 'models/skill';

const smallSkills: Array<[WeaponSkillID, ISkill]> = [
	[WeaponSkillID.FISTS_ATTACK, {
		title: 'Attack',
		cost: 1,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSkillID.FISTS_DISARM, {
		title: 'Disarm',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [SkillStatus.DISARM]
	}],
	[WeaponSkillID.DAGGER_ATTACK, {
		title: 'Attack',
		cost: 1,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSkillID.DAGGER_STAB, {
		title: 'Stab',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 2,
		elementalDamage: 0,
		status: []
	}]
];

export default smallSkills;
