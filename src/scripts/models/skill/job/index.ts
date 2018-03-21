import DataList from 'models/data-list';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

import berserking from 'models/skill/job/berserking';
import knighthood from 'models/skill/job/knighthood';
import supremacy from 'models/skill/job/supremacy';
import program from 'models/skill/job/program';
import weaponMastery from 'models/skill/job/weapon-mastery';
import combat from 'models/skill/job/combat';
import tracking from 'models/skill/job/tracking';
import lycanthropy from 'models/skill/job/lycanthropy';
import mysticArt from 'models/skill/job/mystic-art';
import divinity from 'models/skill/job/divinity';
import corruption from 'models/skill/job/corruption';
import flameblade from 'models/skill/job/blade-flame';
import waterblade from 'models/skill/job/blade-water';
import airblade from 'models/skill/job/blade-air';
import stoneblade from 'models/skill/job/blade-stone';
import frostblade from 'models/skill/job/blade-frost';
import thunderblade from 'models/skill/job/blade-thunder';
import blitz from 'models/skill/job/blitz';
import aim from 'models/skill/job/aim';
import performance from 'models/skill/job/performance';
import vampirism from 'models/skill/job/vampirism';
import illusion from 'models/skill/job/illusion';
import martialArts from 'models/skill/job/martial-arts';
import assassination from 'models/skill/job/assassination';
import alchemy from 'models/skill/job/alchemy';
import psychokinesis from 'models/skill/job/psychokinesis';
import whiteMagic from 'models/skill/job/magic-white';
import blackMagic from 'models/skill/job/magic-black';
import fireMagic from 'models/skill/job/magic-fire';
import waterMagic from 'models/skill/job/magic-water';
import windMagic from 'models/skill/job/magic-wind';
import earthMagic from 'models/skill/job/magic-earth';
import iceMagic from 'models/skill/job/magic-ice';
import thunderMagic from 'models/skill/job/magic-thunder';

export const JobSKills = new DataList<JobSKillID, ISKill>([
	[JobSKillID.NONE, {
		title: 'Job Skill',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
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
]);
