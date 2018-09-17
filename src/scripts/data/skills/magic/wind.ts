import { ISkillData } from 'engine/skill/skill-data';
import { WindMagicSkillID } from 'engine/skill/magic';

const windMagic: { [id in WindMagicSkillID]: ISkillData; } = {
	WIND_MAGIC_AIR_BLAST: {
		title: 'Air Blast',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WIND',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	WIND_MAGIC_JET_STREAM: {
		title: 'Jet Stream',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WIND',
		physicalDamage: 0.25,
		elementalDamage: 0.25
	},
	WIND_MAGIC_TORNADO: {
		title: 'Tornado',
		cost: 4,
		type: 'ACTIVE',
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'WIND',
		physicalDamage: 0.25,
		elementalDamage: 0.5
	},
	WIND_MAGIC_WIND_AURA: {
		title: 'Wind Aura',
		cost: 0,
		type: 'PASSIVE',
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'WIND',
		elementalDamage: 0.25
	}
};

export default windMagic;
