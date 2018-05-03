import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'models/skill/attributes';

const fireMagic: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.FIRE_MAGIC_FIREBALL, {
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
	}],
	[JobSkillID.FIRE_MAGIC_BURN, {
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
	}],
	[JobSkillID.FIRE_MAGIC_FIRESTORM, {
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
	}],
	[JobSkillID.FIRE_MAGIC_FIRE_AURA, {
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
	}]
];

export const fireMagicSkillset: ISkillset = {
	title: 'Fire Magic',
	description: '',
	skills: fireMagic.map(([id, skill]) => id)
};

export default fireMagic;
