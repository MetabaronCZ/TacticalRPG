import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const flameblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.FLAMEBLADE_FLAMESTRIKE, {
		title: 'Flamestrike',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.FIRE,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
	[JobSKillID.FLAMEBLADE_FIREBALL, {
		title: 'Fireball',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.FIRE,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}]
];

export const flamebladeSkillset: ISkillset = {
	title: 'Flameblade',
	description: '',
	skills: flameblade.map(([id, skill]) => id)
};

export default flameblade;
