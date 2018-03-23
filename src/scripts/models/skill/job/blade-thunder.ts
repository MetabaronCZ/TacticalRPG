import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const thunderblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.THUNDERBLADE_THUNDERSTRIKE, {
		title: 'Thunderstrike',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.THUNDERBLADE_THUNDREBOLT, {
		title: 'Thunderbolt',
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export const thunderbladeSkillset: ISkillset = {
	title: 'Thunderblade',
	description: '',
	skills: thunderblade.map(([id, skill]) => id)
};

export default thunderblade;
