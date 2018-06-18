import { ISkillset } from 'modules/skillset';
import { MagicSkillID, IWhiteMagicSkillList } from 'modules/skill/magic/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const whiteMagic: IWhiteMagicSkillList = {
	[MagicSkillID.WHITE_MAGIC_HEAL]: {
		title: 'Heal',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ALLY,
		isAreaEffect: false,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 1,
		status: []
	},
	[MagicSkillID.WHITE_MAGIC_REMEDY]: {
		title: 'Remedy',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ALLY,
		isAreaEffect: false,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	},
	[MagicSkillID.WHITE_MAGIC_REGENERATE]: {
		title: 'Regenerate',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ALLY,
		isAreaEffect: false,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0.5,
		status: [SkillStatus.REGEN]
	},
	[MagicSkillID.WHITE_MAGIC_GROUP_HEAL]: {
		title: 'Group Heal',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ALLY,
		isAreaEffect: true,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0.5,
		status: []
	},
	[MagicSkillID.WHITE_MAGIC_HOLY_AURA]: {
		title: 'Holy Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ALLY,
		isAreaEffect: true,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: []
	},
	[MagicSkillID.WHITE_MAGIC_REVIVE]: {
		title: 'Revive',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ALLY,
		isAreaEffect: false,
		element: SkillElement.HOLY,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}
};

export const whiteMagicSkillset: ISkillset = {
	title: 'White Magic',
	description: '',
	skills: Object.keys(whiteMagic) as MagicSkillID[]
};

export default whiteMagic;
