import { ArchetypeID as ArchID } from 'models/archetype';
import { JobSKillID } from 'models/skill/job/id';
import JobList from 'models/job/list';

import { aimSkills } from 'models/skill/job/aim';
import { blitzSkills } from 'models/skill/job/blitz';
import { combatSkills } from 'models/skill/job/combat';
import { alchemySkills } from 'models/skill/job/alchemy';
import { programSkills } from 'models/skill/job/program';
import { divinitySkills } from 'models/skill/job/divinity';
import { illusionSkills } from 'models/skill/job/illusion';
import { trackingSkills } from 'models/skill/job/tracking';
import { supremacySkills } from 'models/skill/job/supremacy';
import { vampirismSkills } from 'models/skill/job/vampirism';
import { mysticArtSkills } from 'models/skill/job/mystic-art';
import { berserkingSkills } from 'models/skill/job/berserking';
import { corruptionSkills } from 'models/skill/job/corruption';
import { knighthoodSkills } from 'models/skill/job/knighthood';
import { blackMagicSkills } from 'models/skill/job/magic-black';
import { whiteMagicSkills } from 'models/skill/job/magic-white';
import { lycanthropySkills } from 'models/skill/job/lycanthropy';
import { martiaArtsSkills } from 'models/skill/job/martial-arts';
import { performanceSkills } from 'models/skill/job/performance';
import { assassinationSkills } from 'models/skill/job/assassination';
import { psychokinesisSkills } from 'models/skill/job/psychokinesis';
import { weaponMasterySkills } from 'models/skill/job/weapon-mastery';

export enum JobID {
	NONE = 'NONE',
	BAR = 'BAR', KNG = 'KNG', DRG = 'DRG', CYB = 'CYB',
	WAR = 'WAR', BRW = 'BRW', HUN = 'HUN', WER = 'WER',
	BLD = 'BLD', PAL = 'PAL', DRK = 'DRK', SPL = 'SPL',
	ROG = 'ROG', RAN = 'RAN', ENT = 'ENT', VMP = 'VMP',
	TRI = 'TRI', MNK = 'MNK', ASA = 'ASA', ALC = 'ALC',
	PSY = 'PSY', PRI = 'PRI', SOR = 'SOR', ELM = 'ELM'
}

export interface IJobData {
	readonly title: string;
	readonly description: string;
	readonly archetype: ArchID[];
	readonly skills: JobSKillID[];
}

export const Jobs = new JobList([
	[JobID.NONE, {
		title: 'none',
		description: 'No job selected',
		archetype: [],
		skills: []
	}],
	[JobID.BAR, {
		title: 'Barbarian',
		description: 'A warrior with extreme strength',
		archetype: [ArchID.PP],
		skills: berserkingSkills
	}],
	[JobID.KNG, {
		title: 'Knight',
		description: 'A warrior with high endurance',
		archetype: [ArchID.PP],
		skills: knighthoodSkills
	}],
	[JobID.DRG, {
		title: 'Dragonkin',
		description: '???',
		archetype: [ArchID.PP],
		skills: supremacySkills
	}],
	[JobID.CYB, {
		title: 'Cyborg',
		description: '???',
		archetype: [ArchID.PP],
		skills: programSkills
	}],
	[JobID.WAR, {
		title: 'Warrior',
		description: 'A master of weapons',
		archetype: [ArchID.PS, ArchID.SP],
		skills: weaponMasterySkills
	}],
	[JobID.BRW, {
		title: 'Brawler',
		description: '???',
		archetype: [ArchID.PS, ArchID.SP],
		skills: combatSkills
	}],
	[JobID.HUN, {
		title: 'Hunter',
		description: '???',
		archetype: [ArchID.PS, ArchID.SP],
		skills: trackingSkills
	}],
	[JobID.WER, {
		title: 'Werewolf',
		description: 'A feral warrior',
		archetype: [ArchID.PS, ArchID.SP],
		skills: lycanthropySkills
	}],
	[JobID.BLD, {
		title: 'Blademaster',
		description: '???',
		archetype: [ArchID.PM, ArchID.MP],
		skills: mysticArtSkills
	}],
	[JobID.PAL, {
		title: 'Paladin',
		description: 'A holy guardian',
		archetype: [ArchID.PM, ArchID.MP],
		skills: divinitySkills
	}],
	[JobID.DRK, {
		title: 'Dark Knight',
		description: 'A knight of darkness',
		archetype: [ArchID.PM, ArchID.MP],
		skills: corruptionSkills
	}],
	[JobID.SPL, {
		title: 'Spellblade',
		description: '???',
		archetype: [ArchID.PM, ArchID.MP],
		skills: []
	}],
	[JobID.ROG, {
		title: 'Rogue',
		description: '???',
		archetype: [ArchID.SS],
		skills: blitzSkills
	}],
	[JobID.RAN, {
		title: 'Ranger',
		description: 'A ranged weapon specialist',
		archetype: [ArchID.SS],
		skills: aimSkills
	}],
	[JobID.ENT, {
		title: 'Entertainer',
		description: '???',
		archetype: [ArchID.SS],
		skills: performanceSkills
	}],
	[JobID.VMP, {
		title: 'Vampire',
		description: '???',
		archetype: [ArchID.SS],
		skills: vampirismSkills
	}],
	[JobID.TRI, {
		title: 'Trickster',
		description: '???',
		archetype: [ArchID.SM, ArchID.MS],
		skills: illusionSkills
	}],
	[JobID.MNK, {
		title: 'Monk',
		description: '???',
		archetype: [ArchID.SM, ArchID.MS],
		skills: martiaArtsSkills
	}],
	[JobID.ASA, {
		title: 'Assassin',
		description: 'A fighter of shadows',
		archetype: [ArchID.SM, ArchID.MS],
		skills: assassinationSkills
	}],
	[JobID.ALC, {
		title: 'Alchemist',
		description: '???',
		archetype: [ArchID.SM, ArchID.MS],
		skills: alchemySkills
	}],
	[JobID.PSY, {
		title: 'Psyker',
		description: 'A fighter with strong mental abilites',
		archetype: [ArchID.MM],
		skills: psychokinesisSkills
	}],
	[JobID.PRI, {
		title: 'Priest',
		description: 'A holy magician',
		archetype: [ArchID.MM],
		skills: whiteMagicSkills
	}],
	[JobID.SOR, {
		title: 'Sorcerer',
		description: 'A dark magician',
		archetype: [ArchID.MM],
		skills: blackMagicSkills
	}],
	[JobID.ELM, {
		title: 'Elemental Mage',
		description: 'A master of elemental magic',
		archetype: [ArchID.MM],
		skills: []
	}]
]);
