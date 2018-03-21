import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const thunderBlade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.THUNDERBLADE_NONE, {
		title: 'Thunderblade',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const thunderBladeSkills = thunderBlade.map(([id, skill]) => id);
export default thunderBlade;
