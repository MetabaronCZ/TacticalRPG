import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const flameBlade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.FLAMEBLADE_NONE, {
		title: 'Flameblade',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const flameBladeSkills = flameBlade.map(([id, skill]) => id);
export default flameBlade;
