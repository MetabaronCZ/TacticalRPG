import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const knighthood: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.KNIGHTHOOD_ULTIMATE_DEFENSE, {
		title: 'Ultimate Defense',
		type: SKillType.ACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ULTIMATE
	}]
];

export const knighthoodSkillset: ISkillset = {
	title: 'Knighthood',
	description: '',
	skills: knighthood.map(([id, skill]) => id)
};

export default knighthood;
