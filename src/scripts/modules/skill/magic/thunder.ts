import { ISkillset } from 'modules/skillset';
import { MagicSkillID, IThunderMagicSkillList } from 'modules/skill/magic/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const thunderMagic: IThunderMagicSkillList = {
	[MagicSkillID.THUNDER_MAGIC_THUNDERBOLT]: {
		title: 'Thunderbolt',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.THUNDER,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	},
	[MagicSkillID.THUNDER_MAGIC_SHOCK]: {
		title: 'Shock',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.THUNDER,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.SHOCK]
	},
	[MagicSkillID.THUNDER_MAGIC_THUNDERSTORM]: {
		title: 'Thunderstorm',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		isAreaEffect: true,
		element: SkillElement.THUNDER,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	},
	[MagicSkillID.THUNDER_MAGIC_THUNDER_AURA]: {
		title: 'Thunder Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.SELF,
		isAreaEffect: true,
		element: SkillElement.THUNDER,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: [SkillStatus.SHOCK]
	}
};

export const thunderMagicSkillset: ISkillset = {
	title: 'Thunder Magic',
	description: '',
	skills: Object.keys(thunderMagic) as MagicSkillID[]
};

export default thunderMagic;
