import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

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
