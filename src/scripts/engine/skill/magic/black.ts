import { IBlackMagicSkillList } from 'engine/skill/magic/types';

const blackMagic: IBlackMagicSkillList = {
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
