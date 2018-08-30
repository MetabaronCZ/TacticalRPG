import { ISkillset } from 'modules/skillset/types';
import { StatusEffectID } from 'modules/status-effect/types';
import { MagicSkillID, IPsychokinesisSkillList } from 'modules/skill/magic/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const psychokinesis: IPsychokinesisSkillList = {
	[MagicSkillID.PSYCHOKINESIS_KINETIC_STRIKE]: {
		title: 'Kinetic Strike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.PSYCHIC,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	},
	[MagicSkillID.PSYCHOKINESIS_FORGET]: {
		title: 'Forget',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.PSYCHIC,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [StatusEffectID.FORGET]
	},
	[MagicSkillID.PSYCHOKINESIS_PSYCHODOME]: {
		title: 'Psychodome',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		element: SkillElement.PSYCHIC,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}
};

export const psychokinesisSkillset: ISkillset = {
	title: 'Psychokinesis',
	description: '',
	element: SkillElement.PSYCHIC,
	skills: Object.keys(psychokinesis) as MagicSkillID[]
};

export default psychokinesis;
