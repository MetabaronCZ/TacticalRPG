import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const thunderblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.THUNDERBLADE_THUNDERSTRIKE, {
		title: 'Thunderstrike',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
	[JobSKillID.THUNDERBLADE_THUNDREBOLT, {
		title: 'Thunderbolt',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.THUNDER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}]
];

export const thunderbladeSkillset: ISkillset = {
	title: 'Thunderblade',
	description: '',
	skills: thunderblade.map(([id, skill]) => id)
};

export default thunderblade;
