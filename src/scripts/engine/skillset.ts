import DataList from 'core/data-list';

import { SkillElement } from 'engine/skill';
import { MagicSkillID } from 'engine/skill/magic/types';
import { psychokinesisSkillset } from 'engine/skill/magic/psychokinesis';
import { whiteMagicSkillset } from 'engine/skill/magic/white';
import { blackMagicSkillset } from 'engine/skill/magic/black';
import { fireMagicSkillset } from 'engine/skill/magic/fire';
import { waterMagicSkillset } from 'engine/skill/magic/water';
import { windMagicSkillset } from 'engine/skill/magic/wind';
import { earthMagicSkillset } from 'engine/skill/magic/earth';
import { iceMagicSkillset } from 'engine/skill/magic/ice';
import { thunderMagicSkillset } from 'engine/skill/magic/thunder';

export type SkillsetID =
	'NONE' |
	'PSYCHOKINESIS' |
	'WHITE_MAGIC' |
	'BLACK_MAGIC' |
	'FIRE_MAGIC' |
	'WATER_MAGIC' |
	'WIND_MAGIC' |
	'EARTH_MAGIC' |
	'ICE_MAGIC' |
	'THUNDER_MAGIC';

export interface ISkillset {
	readonly title: string;
	readonly description: string;
	readonly element: SkillElement;
	readonly skills: MagicSkillID[];
}

const Skillsets = new DataList<SkillsetID, ISkillset>({
	NONE: {
		title: 'none',
		description: '',
		element: 'NONE',
		skills: []
	},
	PSYCHOKINESIS: psychokinesisSkillset,
	WHITE_MAGIC: whiteMagicSkillset,
	BLACK_MAGIC: blackMagicSkillset,
	FIRE_MAGIC: fireMagicSkillset,
	WATER_MAGIC: waterMagicSkillset,
	WIND_MAGIC: windMagicSkillset,
	EARTH_MAGIC: earthMagicSkillset,
	ICE_MAGIC: iceMagicSkillset,
	THUNDER_MAGIC: thunderMagicSkillset
});

export default Skillsets;
