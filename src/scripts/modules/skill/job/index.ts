import DataList from 'core/data-list';

import { ISkill } from 'modules/skill';
import { JobSkillID } from 'modules/skill/job/types';
import berserking from 'modules/skill/job/berserking';
import knighthood from 'modules/skill/job/knighthood';
import supremacy from 'modules/skill/job/supremacy';
import program from 'modules/skill/job/program';
import weaponMastery from 'modules/skill/job/weapon-mastery';
import combat from 'modules/skill/job/combat';
import tracking from 'modules/skill/job/tracking';
import lycanthropy from 'modules/skill/job/lycanthropy';
import mysticArt from 'modules/skill/job/mystic-art';
import divinity from 'modules/skill/job/divinity';
import corruption from 'modules/skill/job/corruption';
import flameblade from 'modules/skill/job/blade-flame';
import waterblade from 'modules/skill/job/blade-water';
import airblade from 'modules/skill/job/blade-air';
import stoneblade from 'modules/skill/job/blade-stone';
import frostblade from 'modules/skill/job/blade-frost';
import thunderblade from 'modules/skill/job/blade-thunder';
import blitz from 'modules/skill/job/blitz';
import aim from 'modules/skill/job/aim';
import performance from 'modules/skill/job/performance';
import vampirism from 'modules/skill/job/vampirism';
import illusion from 'modules/skill/job/illusion';
import martialArts from 'modules/skill/job/martial-arts';
import assassination from 'modules/skill/job/assassination';
import alchemy from 'modules/skill/job/alchemy';
import psychokinesis from 'modules/skill/job/psychokinesis';
import whiteMagic from 'modules/skill/job/magic-white';
import blackMagic from 'modules/skill/job/magic-black';
import fireMagic from 'modules/skill/job/magic-fire';
import waterMagic from 'modules/skill/job/magic-water';
import windMagic from 'modules/skill/job/magic-wind';
import earthMagic from 'modules/skill/job/magic-earth';
import iceMagic from 'modules/skill/job/magic-ice';
import thunderMagic from 'modules/skill/job/magic-thunder';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

export class JobSkillList extends DataList<JobSkillID, ISkill> {}

export const JobSkills = new JobSkillList({
	[JobSkillID.NONE]: {
		title: 'Job Skill',
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
	},
	...berserking,
	...knighthood,
	...supremacy,
	...program,
	...weaponMastery,
	...combat,
	...tracking,
	...lycanthropy,
	...mysticArt,
	...divinity,
	...corruption,
	...flameblade,
	...waterblade,
	...airblade,
	...stoneblade,
	...frostblade,
	...thunderblade,
	...blitz,
	...aim,
	...performance,
	...vampirism,
	...illusion,
	...martialArts,
	...assassination,
	...alchemy,
	...psychokinesis,
	...whiteMagic,
	...blackMagic,
	...fireMagic,
	...waterMagic,
	...windMagic,
	...earthMagic,
	...iceMagic,
	...thunderMagic
});
