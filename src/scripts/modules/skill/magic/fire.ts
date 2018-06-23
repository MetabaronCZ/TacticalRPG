import { ISkillset } from 'modules/skillset/types';
import { MagicSkillID, IFireMagicSkillList } from 'modules/skill/magic/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const fireMagic: IFireMagicSkillList = {
	[MagicSkillID.FIRE_MAGIC_FIREBALL]: {
		title: 'Fireball',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.FIRE,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	},
	[MagicSkillID.FIRE_MAGIC_BURN]: {
		title: 'Burn',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.FIRE,
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: [SkillStatus.BURN]
	},
	[MagicSkillID.FIRE_MAGIC_FIRESTORM]: {
		title: 'Firestorm',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.AOE3x3,
		target: SkillTarget.ENEMY,
		isAreaEffect: true,
		element: SkillElement.FIRE,
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		status: []
	},
	[MagicSkillID.FIRE_MAGIC_FIRE_AURA]: {
		title: 'Fire Aura',
		cost: 0,
		type: SkillType.PASSIVE,
		range: SkillRange.R0,
		area: SkillArea.AOE3x3,
		target: SkillTarget.SELF,
		isAreaEffect: false,
		element: SkillElement.FIRE,
		physicalDamage: 0,
		elementalDamage: 0.25,
		status: [SkillStatus.BURN]
	}
};

export const fireMagicSkillset: ISkillset = {
	title: 'Fire Magic',
	description: '',
	skills: Object.keys(fireMagic) as MagicSkillID[]
};

export default fireMagic;
