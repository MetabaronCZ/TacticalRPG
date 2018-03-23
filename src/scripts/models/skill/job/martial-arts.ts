import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const martialArts: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.MARTIAL_ARTS_NONE, {
		title: 'Martial Arts',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const martialArtsSkillset: ISkillset = {
	title: 'Martial Arts',
	description: '',
	skills: martialArts.map(([id, skill]) => id)
};

export default martialArts;
