import { ISkillData } from 'engine/skill/skill-data';
import { BlackMagicSkillID } from 'engine/skill/magic';

const blackMagic: { [id in BlackMagicSkillID]: ISkillData; } = {
	BLACK_MAGIC_DARK_AURA: {
		title: 'Dark Aura',
		cost: 0,
		type: 'PASSIVE',
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'DARK'
	}
};

export default blackMagic;
