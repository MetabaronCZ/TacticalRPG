import { ISkillset } from 'modules/skillset/types';
import { StatusEffectID } from 'modules/status-effect/types';
import { MagicSkillID, IWaterMagicSkillList } from 'modules/skill/magic/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const waterMagic: IWaterMagicSkillList = {
	[MagicSkillID.WATER_MAGIC_SPLASH]: {
		title: 'Splash',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.WATER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	},
	[MagicSkillID.WATER_MAGIC_SILENCE]: {
		title: 'Silence',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.WATER,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [StatusEffectID.SILENCE]
	},
	[MagicSkillID.WATER_MAGIC_FLOOD]: {
		title: 'Flood',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		element: SkillElement.WATER,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	},
	[MagicSkillID.WATER_MAGIC_WATER_AURA]: {
		title: 'Water Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.SELF,
		element: SkillElement.WATER,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: [StatusEffectID.SILENCE]
	}
};

export const waterMagicSkillset: ISkillset = {
	title: 'Water Magic',
	description: '',
	element: SkillElement.WATER,
	skills: Object.keys(waterMagic) as MagicSkillID[]
};

export default waterMagic;
