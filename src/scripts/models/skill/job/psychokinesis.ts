import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const psychokinesis: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.PSYCHOKINESIS_KINETIC_STRIKE, {
		title: 'Kinetic Strike',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.PSYCHOKINESIS_FORGET, {
		title: 'Forget',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.PSYCHOKINESIS_PSYCHODOME, {
		title: 'Psychodome',
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}]
];

export const psychokinesisSkillset: ISkillset = {
	title: 'Psychokinesis',
	description: '',
	skills: psychokinesis.map(([id, skill]) => id)
};

export default psychokinesis;
