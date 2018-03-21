import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const waterBlade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WATERBLADE_NONE, {
		title: 'Waterblade',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const waterBladeSkills = waterBlade.map(([id, skill]) => id);
export default waterBlade;
