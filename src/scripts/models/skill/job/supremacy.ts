import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const supremacy: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.SUPREMACY_NONE, {
		title: 'Supremacy',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const supremacySkillset: ISkillset = {
	title: 'Supremacy',
	description: '',
	skills: supremacy.map(([id, skill]) => id)
};

export default supremacy;
