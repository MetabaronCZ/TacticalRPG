import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const stoneblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.STONEBLADE_EARTHSTRIKE, {
		title: 'Earthstrike',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.EARTH,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
	[JobSKillID.STONEBLADE_BOULDER, {
		title: 'Boulder',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.EARTH,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}]
];

export const stonebladeSkillset: ISkillset = {
	title: 'Stoneblade',
	description: '',
	skills: stoneblade.map(([id, skill]) => id)
};

export default stoneblade;
