import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const frostBlade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.FROSTBLADE_FROSTSTRIKE, {
		title: 'Froststrike',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.FROSTBLADE_FROSTSPEAR, {
		title: 'Frostspear',
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export const frostBladeSkills = frostBlade.map(([id, skill]) => id);
export default frostBlade;
