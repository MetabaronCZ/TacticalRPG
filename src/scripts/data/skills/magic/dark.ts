import { ISkillData } from 'modules/skill/skill-data';
import { DarkMagicSkillID } from 'modules/skill/magic';

const darkMagic: { [id in DarkMagicSkillID]: ISkillData; } = {
	DRK_DARK_AURA: {
		title: 'Dark Aura',
		cost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'DARK',
		physical: 0,
		magical: 0.25
	}
};

export default darkMagic;
