import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const fireMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.FIRE_MAGIC_NONE, {
		title: 'Fire Magic',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const fireMagicSkills = fireMagic.map(([id, skill]) => id);
export default fireMagic;
