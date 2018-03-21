import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const psychokinesis: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.PSYCHOKINESIS_NONE, {
		title: 'Psychokinesis',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const psychokinesisSkills = psychokinesis.map(([id, skill]) => id);
export default psychokinesis;
