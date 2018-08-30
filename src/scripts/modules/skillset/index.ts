import DataList from 'core/data-list';

import { SkillsetID, ISkillset } from 'modules/skillset/types';
import { psychokinesisSkillset } from 'modules/skill/magic/psychokinesis';
import { whiteMagicSkillset } from 'modules/skill/magic/white';
import { blackMagicSkillset } from 'modules/skill/magic/black';
import { fireMagicSkillset } from 'modules/skill/magic/fire';
import { waterMagicSkillset } from 'modules/skill/magic/water';
import { windMagicSkillset } from 'modules/skill/magic/wind';
import { earthMagicSkillset } from 'modules/skill/magic/earth';
import { iceMagicSkillset } from 'modules/skill/magic/ice';
import { thunderMagicSkillset } from 'modules/skill/magic/thunder';
import { SkillElement } from 'modules/skill/attributes';

const Skillsets = new DataList<SkillsetID, ISkillset>({
	[SkillsetID.NONE]: {
		title: 'none',
		description: '',
		element: SkillElement.NONE,
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

export default Skillsets;
