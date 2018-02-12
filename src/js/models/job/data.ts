import { ArchetypeID as ArchID } from 'models/archetype';
import { SkillSetID } from 'models/skill-set';
import { JobList } from 'models/job';

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
	readonly skills: SkillSetID[];
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
		skills: [SkillSetID.BERSERKING]
	}],
	[JobID.KNG, {
		title: 'Knight',
		description: 'A warrior with high endurance',
		archetype: [ArchID.PP],
		skills: [SkillSetID.NONE]
	}],
	[JobID.DRG, {
		title: 'Dragonkin',
		description: '???',
		archetype: [ArchID.PP],
		skills: [SkillSetID.NONE]
	}],
	[JobID.CYB, {
		title: 'Cyborg',
		description: '???',
		archetype: [ArchID.PP],
		skills: [SkillSetID.PROGRAM]
	}],
	[JobID.WAR, {
		title: 'Warrior',
		description: 'A master of weapons',
		archetype: [ArchID.PS, ArchID.SP],
		skills: [SkillSetID.NONE]
	}],
	[JobID.BRW, {
		title: 'Brawler',
		description: '???',
		archetype: [ArchID.PS, ArchID.SP],
		skills: [SkillSetID.NONE]
	}],
	[JobID.HUN, {
		title: 'Hunter',
		description: '???',
		archetype: [ArchID.PS, ArchID.SP],
		skills: [SkillSetID.NONE]
	}],
	[JobID.WER, {
		title: 'Werewolf',
		description: 'A feral warrior',
		archetype: [ArchID.PS, ArchID.SP],
		skills: [SkillSetID.LYCANTROPHY]
	}],
	[JobID.BLD, {
		title: 'Blademaster',
		description: '???',
		archetype: [ArchID.PM, ArchID.MP],
		skills: [SkillSetID.NONE]
	}],
	[JobID.PAL, {
		title: 'Paladin',
		description: 'A holy guardian',
		archetype: [ArchID.PM, ArchID.MP],
		skills: [SkillSetID.NONE]
	}],
	[JobID.DRK, {
		title: 'Dark Knight',
		description: 'A knight of darkness',
		archetype: [ArchID.PM, ArchID.MP],
		skills: [SkillSetID.NONE]
	}],
	[JobID.SPL, {
		title: 'Spellblade',
		description: '???',
		archetype: [ArchID.PM, ArchID.MP],
		skills: [SkillSetID.NONE]
	}],
	[JobID.ROG, {
		title: 'Rogue',
		description: '???',
		archetype: [ArchID.SS],
		skills: [SkillSetID.NONE]
	}],
	[JobID.RAN, {
		title: 'Ranger',
		description: 'A ranged weapon specialist',
		archetype: [ArchID.SS],
		skills: [SkillSetID.NONE]
	}],
	[JobID.ENT, {
		title: 'Entertainer',
		description: '???',
		archetype: [ArchID.SS],
		skills: [SkillSetID.DANCING, SkillSetID.SINGING]
	}],
	[JobID.VMP, {
		title: 'Vampire',
		description: '???',
		archetype: [ArchID.SS],
		skills: [SkillSetID.NONE]
	}],
	[JobID.TRI, {
		title: 'Trickster',
		description: '???',
		archetype: [ArchID.SM, ArchID.MS],
		skills: [SkillSetID.NONE]
	}],
	[JobID.MNK, {
		title: 'Monk',
		description: '???',
		archetype: [ArchID.SM, ArchID.MS],
		skills: [SkillSetID.NONE]
	}],
	[JobID.ASA, {
		title: 'Assassin',
		description: 'A fighter of shadows',
		archetype: [ArchID.SM, ArchID.MS],
		skills: [SkillSetID.NONE]
	}],
	[JobID.ALC, {
		title: 'Alchemist',
		description: '???',
		archetype: [ArchID.SM, ArchID.MS],
		skills: [SkillSetID.NONE]
	}],
	[JobID.PSY, {
		title: 'Psyker',
		description: 'A fighter with strong mental abilites',
		archetype: [ArchID.MM],
		skills: [SkillSetID.MAGIC_KINETIC]
	}],
	[JobID.PRI, {
		title: 'Priest',
		description: 'A holy magician',
		archetype: [ArchID.MM],
		skills: [SkillSetID.MAGIC_HOLY]
	}],
	[JobID.SOR, {
		title: 'Sorcerer',
		description: 'A dark magician',
		archetype: [ArchID.MM],
		skills: [SkillSetID.MAGIC_DARK]
	}],
	[JobID.ELM, {
		title: 'Elemental Mage',
		description: 'A master of elemental magic',
		archetype: [ArchID.MM],
		skills: [SkillSetID.MAGIC_FIRE, SkillSetID.MAGIC_WATER, SkillSetID.MAGIC_AIR, SkillSetID.MAGIC_EARTH]
	}]
]);
