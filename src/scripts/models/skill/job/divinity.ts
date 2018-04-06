import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const divinity: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.DIVINITY_NONE, {
		title: 'Divinity',
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

export const divinitySkillset: ISkillset = {
	title: 'Divinity',
	description: '',
	skills: divinity.map(([id, skill]) => id)
};

export default divinity;
