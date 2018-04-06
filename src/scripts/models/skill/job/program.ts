import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const program: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.PROGRAM_NONE, {
		title: 'Program',
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

export const programSkillset: ISkillset = {
	title: 'Program',
	description: '',
	skills: program.map(([id, skill]) => id)
};

export default program;
