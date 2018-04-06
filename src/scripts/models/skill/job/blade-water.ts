import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const waterblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WATERBLADE_WATERSTRIKE, {
		title: 'Waterstrike',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.WATER,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
	[JobSKillID.WATERBLADE_SPLASH, {
		title: 'Splash',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.WATER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}]
];

export const waterbladeSkillset: ISkillset = {
	title: 'Waterblade',
	description: '',
	skills: waterblade.map(([id, skill]) => id)
};

export default waterblade;
