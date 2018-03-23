import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const mysticArt: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.MYSTIC_ART_NONE, {
		title: 'Mystic Arts',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const mysticArtSkillset: ISkillset = {
	title: 'Mystic Arts',
	description: '',
	skills: mysticArt.map(([id, skill]) => id)
};

export default mysticArt;
