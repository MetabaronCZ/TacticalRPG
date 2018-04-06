import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const earthMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.EARTH_MAGIC_BOULDER, {
		title: 'Boulder',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.EARTH,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSKillID.EARTH_MAGIC_EARTH_SPIKE, {
		title: 'Earth Spike',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.EARTH,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.STUN]
	}],
	[JobSKillID.EARTH_MAGIC_EARTHQUAKE, {
		title: 'Earthquake',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.EARTH,
		physicalDamage: 0.25,
		elementalDamage: 5,
		status: []
	}],
	[JobSKillID.EARTH_MAGIC_STONE_SKIN, {
		title: 'Stone Skin',
		cost: 0,
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.EARTH,
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
