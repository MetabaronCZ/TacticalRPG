import JobList from 'modules/job/list';
import { SkillsetID } from 'modules/skillset';
import { ArchetypeID as ArchID } from 'modules/archetype';

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
	readonly skillsets: SkillsetID[];
}

export const Jobs = new JobList([
	[JobID.NONE, {
		title: 'none',
		description: 'No job selected',
		archetype: [],
		skillsets: [SkillsetID.NONE]
	}],
	[JobID.BAR, {
		title: 'Barbarian',
		description: 'A warrior with extreme strength',
		archetype: [ArchID.PP],
		skillsets: [SkillsetID.BERSERKING]
	}],
	[JobID.KNG, {
		title: 'Knight',
		description: 'A warrior with high endurance',
		archetype: [ArchID.PP],
		skillsets: [SkillsetID.KNIGHTHOOD]
	}],
	[JobID.DRG, {
		title: 'Dragonkin',
		description: '???',
		archetype: [ArchID.PP],
		skillsets: [SkillsetID.SUPREMACY]
	}],
	[JobID.CYB, {
		title: 'Cyborg',
		description: '???',
		archetype: [ArchID.PP],
		skillsets: [SkillsetID.PROGRAM]
	}],
	[JobID.WAR, {
		title: 'Warrior',
		description: 'A master of weapons',
		archetype: [ArchID.PS, ArchID.SP],
		skillsets: [SkillsetID.WEAPON_MASTERY]
	}],
	[JobID.BRW, {
		title: 'Brawler',
		description: '???',
		archetype: [ArchID.PS, ArchID.SP],
		skillsets: [SkillsetID.COMBAT]
	}],
	[JobID.HUN, {
		title: 'Hunter',
		description: '???',
		archetype: [ArchID.PS, ArchID.SP],
		skillsets: [SkillsetID.TRACKING]
	}],
	[JobID.WER, {
		title: 'Werewolf',
		description: 'A feral warrior',
		archetype: [ArchID.PS, ArchID.SP],
		skillsets: [SkillsetID.LYCANTHROPY]
	}],
	[JobID.BLD, {
		title: 'Blademaster',
		description: '???',
		archetype: [ArchID.PM, ArchID.MP],
		skillsets: [SkillsetID.MYSTIC_ART]
	}],
	[JobID.PAL, {
		title: 'Paladin',
		description: 'A holy guardian',
		archetype: [ArchID.PM, ArchID.MP],
		skillsets: [SkillsetID.DIVINITY]
	}],
	[JobID.DRK, {
		title: 'Dark Knight',
		description: 'A knight of darkness',
		archetype: [ArchID.PM, ArchID.MP],
		skillsets: [SkillsetID.CORRUPTION]
	}],
	[JobID.SPL, {
		title: 'Spellblade',
		description: '???',
		archetype: [ArchID.PM, ArchID.MP],
		skillsets: [
			SkillsetID.FLAMEBLADE,
			SkillsetID.WATER_MAGIC,
			SkillsetID.AIRBLADE,
			SkillsetID.STONEBLADE,
			SkillsetID.FROSTBLADE,
			SkillsetID.THUNDERBLADE
		]
	}],
	[JobID.ROG, {
		title: 'Rogue',
		description: '???',
		archetype: [ArchID.SS],
		skillsets: [SkillsetID.BLITZ]
	}],
	[JobID.RAN, {
		title: 'Ranger',
		description: 'A ranged weapon specialist',
		archetype: [ArchID.SS],
		skillsets: [SkillsetID.AIM]
	}],
	[JobID.ENT, {
		title: 'Entertainer',
		description: '???',
		archetype: [ArchID.SS],
		skillsets: [SkillsetID.PERFORMANCE]
	}],
	[JobID.VMP, {
		title: 'Vampire',
		description: '???',
		archetype: [ArchID.SS],
		skillsets: [SkillsetID.VAMPIRISM]
	}],
	[JobID.TRI, {
		title: 'Trickster',
		description: '???',
		archetype: [ArchID.SM, ArchID.MS],
		skillsets: [SkillsetID.ILLUSION]
	}],
	[JobID.MNK, {
		title: 'Monk',
		description: '???',
		archetype: [ArchID.SM, ArchID.MS],
		skillsets: [SkillsetID.MARTIAL_ARTS]
	}],
	[JobID.ASA, {
		title: 'Assassin',
		description: 'A fighter of shadows',
		archetype: [ArchID.SM, ArchID.MS],
		skillsets: [SkillsetID.ASSASSINATION]
	}],
	[JobID.ALC, {
		title: 'Alchemist',
		description: '???',
		archetype: [ArchID.SM, ArchID.MS],
		skillsets: [SkillsetID.ALCHEMY]
	}],
	[JobID.PSY, {
		title: 'Psyker',
		description: 'A fighter with strong mental abilites',
		archetype: [ArchID.MM],
		skillsets: [SkillsetID.PSYCHOKINESIS]
	}],
	[JobID.PRI, {
		title: 'Priest',
		description: 'A holy magician',
		archetype: [ArchID.MM],
		skillsets: [SkillsetID.WHITE_MAGIC]
	}],
	[JobID.SOR, {
		title: 'Sorcerer',
		description: 'A dark magician',
		archetype: [ArchID.MM],
		skillsets: [SkillsetID.BLACK_MAGIC]
	}],
	[JobID.ELM, {
		title: 'Elemental Mage',
		description: 'A master of elemental magic',
		archetype: [ArchID.MM],
		skillsets: [
			SkillsetID.FIRE_MAGIC,
			SkillsetID.WATER_MAGIC,
			SkillsetID.WIND_MAGIC,
			SkillsetID.EARTH_MAGIC,
			SkillsetID.ICE_MAGIC,
			SkillsetID.THUNDER_MAGIC
		]
	}]
]);
