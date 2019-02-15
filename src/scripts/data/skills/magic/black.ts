import { ISkillData } from 'modules/skill/skill-data';
import { BlackMagicSkillID } from 'modules/skill/magic';

const blackMagic: { [id in BlackMagicSkillID]: ISkillData; } = {
	BLK_DARK_AURA: {
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

export default blackMagic;
