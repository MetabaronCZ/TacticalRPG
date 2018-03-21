import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const iceMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.ICE_MAGIC_NONE, {
		title: 'Ice Magic',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const iceMagicSkills = iceMagic.map(([id, skill]) => id);
export default iceMagic;
