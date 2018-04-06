import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const frostblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.FROSTBLADE_FROSTSTRIKE, {
		title: 'Froststrike',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.ICE,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
	[JobSKillID.FROSTBLADE_FROSTSPEAR, {
		title: 'Frostspear',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.ICE,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}]
];

export const frostbladeSkillset: ISkillset = {
	title: 'Frostblade',
	description: '',
	skills: frostblade.map(([id, skill]) => id)
};

export default frostblade;
