import { ISkillData } from 'modules/skill/skill-data';
import { WindMagicSkillID } from 'modules/skill/magic';

const windMagic: { [id in WindMagicSkillID]: ISkillData; } = {
	WND_AIR_BLAST: {
		title: 'Air Blast',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WIND',
		physicalDamage: 0.5,
		magicalDamage: 1
	},
	WND_JET_STREAM: {
		title: 'Jet Stream',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WIND',
		physicalDamage: 0.25,
		magicalDamage: 0.25,
		cooldown: 1
	},
	WND_TORNADO: {
		title: 'Tornado',
		cost: 4,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'WIND',
		physicalDamage: 0.25,
		magicalDamage: 0.5,
		cooldown: 2
	},
	WND_WIND_AURA: {
		title: 'Wind Aura',
		cost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'WIND',
		magicalDamage: 0.25
	}
};

export default windMagic;
