import { IFireMagicSkillList } from 'engine/skill/magic/types';
import { SkillRange } from 'engine/skill';

const fireMagic: IFireMagicSkillList = {
	FIRE_MAGIC_FIREBALL: {
		title: 'Fireball',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'FIRE',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	FIRE_MAGIC_BURN: {
		title: 'Burn',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'FIRE',
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: ['BURN']
	},
	FIRE_MAGIC_FIRESTORM: {
		title: 'Firestorm',
		cost: 4,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'FIRE',
		physicalDamage: 0.25,
		elementalDamage: 0.5
	},
	FIRE_MAGIC_FIRE_AURA: {
		title: 'Fire Aura',
		cost: 0,
		type: 'PASSIVE',
		range: SkillRange.R0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'FIRE',
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: ['BURN']
	}
};

export default fireMagic;
