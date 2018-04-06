import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const thunderMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.THUNDER_MAGIC_THUNDERBOLT, {
		title: 'Thunderbolt',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.THUNDER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSKillID.THUNDER_MAGIC_SHOCK, {
		title: 'Shock',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.THUNDER,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.SHOCK]
	}],
	[JobSKillID.THUNDER_MAGIC_THUNDERSTORM, {
		title: 'Thunderstorm',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.THUNDER,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	}],
	[JobSKillID.THUNDER_MAGIC_THUNDER_AURA, {
		title: 'Thunder Aura',
		cost: 0,
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.THUNDER,
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
