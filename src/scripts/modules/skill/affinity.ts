import { SkillElement } from 'modules/skill/attributes';

type IElementAffinityTable = {
	[E in SkillElement]: SkillElement|null;
};

export const ElementAffinityTable: IElementAffinityTable = {
	[SkillElement.NONE]: null,
	[SkillElement.FIRE]: SkillElement.ICE,
	[SkillElement.ICE]: SkillElement.WIND,
	[SkillElement.WIND]: SkillElement.EARTH,
	[SkillElement.EARTH]: SkillElement.THUNDER,
	[SkillElement.THUNDER]: SkillElement.WATER,
	[SkillElement.WATER]: SkillElement.FIRE,
	[SkillElement.DARK]: SkillElement.HOLY,
	[SkillElement.HOLY]: SkillElement.DARK,
	[SkillElement.PSYCHIC]: SkillElement.PSYCHIC
};
