import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const vampirism: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.VAMPIRISM_NONE, {
		title: 'Vampirism',
		cost: 0,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
];

export const vampirismSkillset: ISkillset = {
	title: 'Vampirism',
	description: '',
	skills: vampirism.map(([id, skill]) => id)
};

export default vampirism;
