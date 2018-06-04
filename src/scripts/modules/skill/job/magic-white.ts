import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const whiteMagic: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.WHITE_MAGIC_HEAL, {
		title: 'Heal',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ALLY,
		isAreaEffect: false,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 1,
		status: []
	}],
	[JobSkillID.WHITE_MAGIC_REMEDY, {
		title: 'Remedy',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ALLY,
		isAreaEffect: false,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
	[JobSkillID.WHITE_MAGIC_REGENERATE, {
		title: 'Regenerate',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ALLY,
		isAreaEffect: false,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0.5,
		status: [SkillStatus.REGEN]
	}],
	[JobSkillID.WHITE_MAGIC_GROUP_HEAL, {
		title: 'Group Heal',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ALLY,
		isAreaEffect: true,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0.5,
		status: []
	}],
	[JobSkillID.WHITE_MAGIC_HOLY_AURA, {
		title: 'Holy Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ALLY,
		isAreaEffect: true,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: []
	}],
	[JobSkillID.WHITE_MAGIC_REVIVE, {
		title: 'Revive',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ALLY,
		isAreaEffect: false,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}]
];

export const whiteMagicSkillset: ISkillset = {
	title: 'White Magic',
	description: '',
	skills: whiteMagic.map(([id, skill]) => id)
};

export default whiteMagic;
