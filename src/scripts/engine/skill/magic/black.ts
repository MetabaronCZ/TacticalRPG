import { IBlackMagicSkillList, MagicSkillID } from 'engine/skill/magic/types';
import { ISkillset } from 'engine/skillset';
import { SkillRange } from 'engine/skill';

const blackMagic: IBlackMagicSkillList = {
	BLACK_MAGIC_DARK_AURA: {
		title: 'Dark Aura',
		cost: 0,
		type: 'PASSIVE',
		range: SkillRange.R0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'DARK'
	}
};

export const blackMagicSkillset: ISkillset = {
	title: 'Black Magic',
	description: '',
	element: 'DARK',
	skills: Object.keys(blackMagic) as MagicSkillID[]
};

export default blackMagic;
