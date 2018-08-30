import { ISkillset } from 'modules/skillset/types';
import { StatusEffectID } from 'modules/status-effect/types';
import { MagicSkillID, IEarthMagicSkillList } from 'modules/skill/magic/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const earthMagic: IEarthMagicSkillList = {
	[MagicSkillID.EARTH_MAGIC_BOULDER]: {
		title: 'Boulder',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.EARTH,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	},
	[MagicSkillID.EARTH_MAGIC_EARTH_SPIKE]: {
		title: 'Earth Spike',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.EARTH,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [StatusEffectID.STUN]
	},
	[MagicSkillID.EARTH_MAGIC_EARTHQUAKE]: {
		title: 'Earthquake',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		element: SkillElement.EARTH,
		physicalDamage: 0.25,
		elementalDamage: 5,
		status: []
	},
	[MagicSkillID.EARTH_MAGIC_STONE_SKIN]: {
		title: 'Stone Skin',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.SINGLE,
		target: SkillTarget.SELF,
		element: SkillElement.EARTH,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [StatusEffectID.IRON_SKIN]
	}
};

export const earthMagicSkillset: ISkillset = {
	title: 'Earth Magic',
	description: '',
	element: SkillElement.EARTH,
	skills: Object.keys(earthMagic) as MagicSkillID[]
};

export default earthMagic;
