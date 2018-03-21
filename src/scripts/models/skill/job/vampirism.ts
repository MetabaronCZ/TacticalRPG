import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const vampirism: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.VAMPIRISM_NONE, {
		title: 'Vampirism',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const vampirismSkills = vampirism.map(([id, skill]) => id);
export default vampirism;
