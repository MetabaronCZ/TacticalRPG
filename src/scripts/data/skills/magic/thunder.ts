import { ISkillData } from 'modules/skill/skill-data';
import { ThunderMagicSkillID } from 'modules/skill/magic';

const thunderMagic: { [id in ThunderMagicSkillID]: ISkillData; } = {
	THUNDER_MAGIC_THUNDERBOLT: {
		title: 'Thunderbolt',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
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
		grade: 1,
		range: 4,
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
		grade: 2,
		range: 4,
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
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'THUNDER',
		elementalDamage: 0.25,
		status: ['SHOCK']
	}
};

export default thunderMagic;
