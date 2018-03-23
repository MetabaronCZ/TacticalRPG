import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const lycanthropy: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.LYCANTHROPY_NONE, {
		title: 'Lycanthropy',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const lycanthropySkillset: ISkillset = {
	title: 'Lycanthropy',
	description: '',
	skills: lycanthropy.map(([id, skill]) => id)
};

export default lycanthropy;
