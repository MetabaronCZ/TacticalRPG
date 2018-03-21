import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const frostBlade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.FROSTBLADE_NONE, {
		title: 'Frostblade',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const frostBladeSkills = frostBlade.map(([id, skill]) => id);
export default frostBlade;
