import { ISkillset } from 'modules/skillset';
import { JobSkillID, IPsychokinesisJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const psychokinesis: IPsychokinesisJobSkillList = {
	[JobSkillID.PSYCHOKINESIS_KINETIC_STRIKE]: {
		title: 'Kinetic Strike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.PSYCHIC,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	},
	[JobSkillID.PSYCHOKINESIS_FORGET]: {
		title: 'Forget',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.PSYCHIC,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [SkillStatus.FORGET]
	},
	[JobSkillID.PSYCHOKINESIS_PSYCHODOME]: {
		title: 'Psychodome',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		isAreaEffect: true,
		element: SkillElement.PSYCHIC,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}
};

export const psychokinesisSkillset: ISkillset = {
	title: 'Psychokinesis',
	description: '',
	skills: Object.keys(psychokinesis) as JobSkillID[]
};

export default psychokinesis;
