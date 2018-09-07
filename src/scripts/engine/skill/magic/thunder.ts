import { IThunderMagicSkillList, MagicSkillID } from 'engine/skill/magic/types';
import { ISkillset } from 'engine/skillset';
import { SkillRange } from 'engine/skill';

const thunderMagic: IThunderMagicSkillList = {
	THUNDER_MAGIC_THUNDERBOLT: {
		title: 'Thunderbolt',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'THUNDER',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	THUNDER_MAGIC_SHOCK: {
		title: 'Shock',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'THUNDER',
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: ['SHOCK']
	},
	THUNDER_MAGIC_THUNDERSTORM: {
		title: 'Thunderstorm',
		cost: 4,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'THUNDER',
		physicalDamage: 0.25,
		elementalDamage: 0.5
	},
	THUNDER_MAGIC_THUNDER_AURA: {
		title: 'Thunder Aura',
		cost: 0,
		type: 'PASSIVE',
		range: SkillRange.R0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'THUNDER',
		elementalDamage: 0.25,
		status: ['SHOCK']
	}
};

export const thunderMagicSkillset: ISkillset = {
	title: 'Thunder Magic',
	description: '',
	element: 'THUNDER',
	skills: Object.keys(thunderMagic) as MagicSkillID[]
};

export default thunderMagic;
