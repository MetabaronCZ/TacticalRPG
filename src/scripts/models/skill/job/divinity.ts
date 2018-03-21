import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const divinity: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.DIVINITY_NONE, {
		title: 'Divinity',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const divinitySkills = divinity.map(([id, skill]) => id);
export default divinity;
