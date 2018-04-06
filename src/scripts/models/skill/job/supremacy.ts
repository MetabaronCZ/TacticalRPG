import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const supremacy: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.SUPREMACY_NONE, {
		title: 'Supremacy',
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

export const supremacySkillset: ISkillset = {
	title: 'Supremacy',
	description: '',
	skills: supremacy.map(([id, skill]) => id)
};

export default supremacy;
