import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const blitz: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.BLITZ_NONE, {
		title: 'Blitz',
		cost: 0,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
];

export const blitzSkillset: ISkillset = {
	title: 'Blitz',
	description: '',
	skills: blitz.map(([id, skill]) => id)
};

export default blitz;
