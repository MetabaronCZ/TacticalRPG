import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const combat: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.COMBAT_NONE, {
		title: 'Combat',
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

export const combatSkillset: ISkillset = {
	title: 'Combat',
	description: '',
	skills: combat.map(([id, skill]) => id)
};

export default combat;
