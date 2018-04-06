import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const knighthood: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.KNIGHTHOOD_ULTIMATE_DEFENSE, {
		title: 'Ultimate Defense',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [SkillStatus.ULTIMATE_DEFENSE]
	}]
];

export const knighthoodSkillset: ISkillset = {
	title: 'Knighthood',
	description: '',
	skills: knighthood.map(([id, skill]) => id)
};

export default knighthood;
