import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const alchemy: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.ALCHEMY_NONE, {
		title: 'Alchemy',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const alchemySkills = alchemy.map(([id, skill]) => id);
export default alchemy;
