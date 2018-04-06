import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const blackMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.BLACK_MAGIC_DARK_AURA, {
		title: 'Dark Aura',
		cost: 0,
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.DARK,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
];

export const blackMagicSkillset: ISkillset = {
	title: 'Black Magic',
	description: '',
	skills: blackMagic.map(([id, skill]) => id)
};

export default blackMagic;
