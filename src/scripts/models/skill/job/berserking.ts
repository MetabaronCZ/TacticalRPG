import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const berserking: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.BERSERKING_BERSERK, {
		title: 'Berserk',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [SkillStatus.BERSERK]
	}],
];

export const berserkingSkillset: ISkillset = {
	title: 'Berserking',
	description: '',
	skills: berserking.map(([id, skill]) => id)
};

export default berserking;
