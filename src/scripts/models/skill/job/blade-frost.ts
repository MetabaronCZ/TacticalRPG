import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const frostblade: Array<[JobSKillID, ISKill]> = [
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

export const frostbladeSkillset: ISkillset = {
	title: 'Frostblade',
	description: '',
	skills: frostblade.map(([id, skill]) => id)
};

export default frostblade;
