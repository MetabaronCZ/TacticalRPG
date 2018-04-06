import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const psychokinesis: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.PSYCHOKINESIS_KINETIC_STRIKE, {
		title: 'Kinetic Strike',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.PSYCHIC,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}],
	[JobSKillID.PSYCHOKINESIS_FORGET, {
		title: 'Forget',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.PSYCHIC,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [SkillStatus.FORGET]
	}],
	[JobSKillID.PSYCHOKINESIS_PSYCHODOME, {
		title: 'Psychodome',
		cost: 0,
		type: SKillType.PASSIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.PSYCHIC,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}]
];

export const psychokinesisSkillset: ISkillset = {
	title: 'Psychokinesis',
	description: '',
	skills: psychokinesis.map(([id, skill]) => id)
};

export default psychokinesis;
