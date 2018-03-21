import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const corruption: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.CORRUPTION_NONE, {
		title: 'Corruption',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const corruptionSkills = corruption.map(([id, skill]) => id);
export default corruption;
