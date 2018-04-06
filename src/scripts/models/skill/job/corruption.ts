import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const corruption: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.CORRUPTION_NONE, {
		title: 'Corruption',
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

export const corruptionSkillset: ISkillset = {
	title: 'Corruption',
	description: '',
	skills: corruption.map(([id, skill]) => id)
};

export default corruption;
