import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const earthMagic: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.EARTH_MAGIC_BOULDER, {
		title: 'Boulder',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.EARTH,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSkillID.EARTH_MAGIC_EARTH_SPIKE, {
		title: 'Earth Spike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.EARTH,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.STUN]
	}],
	[JobSkillID.EARTH_MAGIC_EARTHQUAKE, {
		title: 'Earthquake',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		isAreaEffect: true,
		element: SkillElement.EARTH,
		physicalDamage: 0.25,
		elementalDamage: 5,
		status: []
	}],
	[JobSkillID.EARTH_MAGIC_STONE_SKIN, {
		title: 'Stone Skin',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.SINGLE,
		target: SkillTarget.SELF,
		isAreaEffect: false,
		element: SkillElement.EARTH,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [SkillStatus.IRON_SKIN]
	}]
];

export const earthMagicSkillset: ISkillset = {
	title: 'Earth Magic',
	description: '',
	skills: earthMagic.map(([id, skill]) => id)
};

export default earthMagic;
