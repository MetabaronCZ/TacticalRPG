import { ISkillset } from 'modules/skillset';
import { JobSkillID, IMysticArtsJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const mysticArt: IMysticArtsJobSkillList = {
	[JobSkillID.MYSTIC_ART_NONE]: {
		title: 'Mystic Arts',
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

export const mysticArtSkillset: ISkillset = {
	title: 'Mystic Arts',
	description: '',
	skills: Object.keys(mysticArt) as JobSkillID[]
};

export default mysticArt;
