import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const program: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.PROGRAM_NONE, {
		title: 'Program',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const programSkills = program.map(([id, skill]) => id);
export default program;
