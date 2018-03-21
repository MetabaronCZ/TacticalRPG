import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const airBlade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.AIRBLADE_NONE, {
		title: 'Airblade',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const airBladeSkills = airBlade.map(([id, skill]) => id);
export default airBlade;
