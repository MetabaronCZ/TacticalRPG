import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const thunderMagic: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.THUNDER_MAGIC_THUNDERBOLT, {
		title: 'Thunderbolt',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.THUNDER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSkillID.THUNDER_MAGIC_SHOCK, {
		title: 'Shock',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.THUNDER,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.SHOCK]
	}],
	[JobSkillID.THUNDER_MAGIC_THUNDERSTORM, {
		title: 'Thunderstorm',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		isAreaEffect: true,
		element: SkillElement.THUNDER,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	}],
	[JobSkillID.THUNDER_MAGIC_THUNDER_AURA, {
		title: 'Thunder Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.SELF,
		isAreaEffect: true,
		element: SkillElement.THUNDER,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: [SkillStatus.SHOCK]
	}]
];

export const thunderMagicSkillset: ISkillset = {
	title: 'Thunder Magic',
	description: '',
	skills: thunderMagic.map(([id, skill]) => id)
};

export default thunderMagic;
