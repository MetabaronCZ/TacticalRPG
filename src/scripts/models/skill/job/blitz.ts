import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const blitz: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.BLITZ_NONE, {
		title: 'Blitz',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const blitzSkillset: ISkillset = {
	title: 'Blitz',
	description: '',
	skills: blitz.map(([id, skill]) => id)
};

export default blitz;
