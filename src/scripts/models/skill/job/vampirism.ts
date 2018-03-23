import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const vampirism: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.VAMPIRISM_NONE, {
		title: 'Vampirism',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const vampirismSkillset: ISkillset = {
	title: 'Vampirism',
	description: '',
	skills: vampirism.map(([id, skill]) => id)
};

export default vampirism;
