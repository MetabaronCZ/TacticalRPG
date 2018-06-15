import { ISkillset } from 'modules/skillset';
import { JobSkillID, IIceMagicJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const iceMagic: IIceMagicJobSkillList = {
	[JobSkillID.ICE_MAGIC_ICE_SPEAR]: {
		title: 'Ice Spear',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.ICE,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	},
	[JobSkillID.ICE_MAGIC_FREEZE]: {
		title: 'Freeze',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.ICE,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.FREEZE]
	},
	[JobSkillID.ICE_MAGIC_BLIZZARD]: {
		title: 'Blizzard',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		isAreaEffect: true,
		element: SkillElement.ICE,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	},
	[JobSkillID.ICE_MAGIC_FROST_AURA]: {
		title: 'Frost Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R1,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		isAreaEffect: true,
		element: SkillElement.ICE,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: [SkillStatus.FREEZE]
	}
};

export const iceMagicSkillset: ISkillset = {
	title: 'Ice Magic',
	description: '',
	skills: Object.keys(iceMagic) as JobSkillID[]
};

export default iceMagic;
