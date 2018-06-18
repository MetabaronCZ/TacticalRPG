import DataList from 'core/data-list';

import { MagicSkillID } from 'modules/skill/magic/types';
import { psychokinesisSkillset } from 'modules/skill/magic/psychokinesis';
import { whiteMagicSkillset } from 'modules/skill/magic/white';
import { blackMagicSkillset } from 'modules/skill/magic/black';
import { fireMagicSkillset } from 'modules/skill/magic/fire';
import { waterMagicSkillset } from 'modules/skill/magic/water';
import { windMagicSkillset } from 'modules/skill/magic/wind';
import { earthMagicSkillset } from 'modules/skill/magic/earth';
import { iceMagicSkillset } from 'modules/skill/magic/ice';
import { thunderMagicSkillset } from 'modules/skill/magic/thunder';

export enum SkillsetID {
	NONE = 'NONE',
	PSYCHOKINESIS = 'PSYCHOKINESIS',
	WHITE_MAGIC = 'WHITE_MAGIC',
	BLACK_MAGIC = 'BLACK_MAGIC',
	FIRE_MAGIC = 'FIRE_MAGIC',
	WATER_MAGIC = 'WATER_MAGIC',
	WIND_MAGIC = 'WIND_MAGIC',
	EARTH_MAGIC = 'EARTH_MAGIC',
	ICE_MAGIC = 'ICE_MAGIC',
	THUNDER_MAGIC = 'THUNDER_MAGIC'
}

export interface ISkillset {
	readonly title: string;
	readonly description: string;
	readonly skills: MagicSkillID[];
}

export const Skillsets = new DataList<SkillsetID, ISkillset>({
	[SkillsetID.NONE]: {
		title: 'none',
		description: '',
		skills: []
	},
	[SkillsetID.PSYCHOKINESIS]: psychokinesisSkillset,
	[SkillsetID.WHITE_MAGIC]: whiteMagicSkillset,
	[SkillsetID.BLACK_MAGIC]: blackMagicSkillset,
	[SkillsetID.FIRE_MAGIC]: fireMagicSkillset,
	[SkillsetID.WATER_MAGIC]: waterMagicSkillset,
	[SkillsetID.WIND_MAGIC]: windMagicSkillset,
	[SkillsetID.EARTH_MAGIC]: earthMagicSkillset,
	[SkillsetID.ICE_MAGIC]: iceMagicSkillset,
	[SkillsetID.THUNDER_MAGIC]: thunderMagicSkillset
});
