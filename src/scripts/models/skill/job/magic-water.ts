import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillStatus, SkillTarget } from 'models/skill';

const waterMagic: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.WATER_MAGIC_SPLASH, {
		title: 'Splash',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.WATER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSkillID.WATER_MAGIC_SILENCE, {
		title: 'Silence',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.WATER,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.SILENCE]
	}],
	[JobSkillID.WATER_MAGIC_FLOOD, {
		title: 'Flood',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		isAreaEffect: true,
		element: SkillElement.WATER,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	}],
	[JobSkillID.WATER_MAGIC_WATER_AURA, {
		title: 'Water Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.SELF,
		isAreaEffect: true,
		element: SkillElement.WATER,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: [SkillStatus.SILENCE]
	}]
];

export const waterMagicSkillset: ISkillset = {
	title: 'Water Magic',
	description: '',
	skills: waterMagic.map(([id, skill]) => id)
};

export default waterMagic;
