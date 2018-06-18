import { ISkillset } from 'modules/skillset';
import { MagicSkillID, IWindMagicSkillList } from 'modules/skill/magic/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const windMagic: IWindMagicSkillList = {
	[MagicSkillID.WIND_MAGIC_AIR_BLAST]: {
		title: 'Air Blast',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.WIND,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	},
	[MagicSkillID.WIND_MAGIC_JET_STREAM]: {
		title: 'Jet Stream',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.WIND,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [] // ??? replace enemy
	},
	[MagicSkillID.WIND_MAGIC_TORNADO]: {
		title: 'Tornado',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		isAreaEffect: true,
		element: SkillElement.WIND,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	},
	[MagicSkillID.WIND_MAGIC_FLOAT]: {
		title: 'Float',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ANY,
		isAreaEffect: false,
		element: SkillElement.WIND,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [SkillStatus.FLOAT]
	},
	[MagicSkillID.WIND_MAGIC_WIND_AURA]: {
		title: 'Wind Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.SELF,
		isAreaEffect: true,
		element: SkillElement.WIND,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: []
	}
};

export const windMagicSkillset: ISkillset = {
	title: 'Wind Magic',
	description: '',
	skills: Object.keys(windMagic) as MagicSkillID[]
};

export default windMagic;
