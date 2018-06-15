import { ISkillset } from 'modules/skillset';
import { JobSkillID, IWeaponMasteryJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const weaponMastery: IWeaponMasteryJobSkillList = {
	[JobSkillID.WEAPON_MASTERY_NONE]: {
		title: 'Weapon Mastery',
		cost: 0,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.NONE,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}
};

export const weaponMasterySkillset: ISkillset = {
	title: 'Weapon Mastery',
	description: '',
	skills: Object.keys(weaponMastery) as JobSkillID[]
};

export default weaponMastery;
