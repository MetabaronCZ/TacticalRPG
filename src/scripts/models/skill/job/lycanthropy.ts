import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const lycanthropy: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.LYCANTHROPY_NONE, {
		title: 'Lycanthropy',
		cost: 0,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
];

export const lycanthropySkillset: ISkillset = {
	title: 'Lycanthropy',
	description: '',
	skills: lycanthropy.map(([id, skill]) => id)
};

export default lycanthropy;
