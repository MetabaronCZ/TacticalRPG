import IJob from 'models/job';
import { EJobs } from 'models/jobs';
import { ESkillSet } from 'models/skill-set';

interface IJobs {
	[job: string]: IJob;
}

const Jobs = {
	[EJobs.BAR]: {
		title: 'Barbarian',
		description: 'A warrior with extreme strength',
		archetype: ['PP'],
		skills: [ESkillSet.BERSERKING]
	},
	[EJobs.KNG]: {
		title: 'Knight',
		description: 'A warrior with high endurance',
		archetype: ['PP'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.DRG]: {
		title: 'Dragonkin',
		description: '???',
		archetype: ['PP'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.CYB]: {
		title: 'Cyborg',
		description: '???',
		archetype: ['PP'],
		skills: [ESkillSet.PROGRAM]
	},
	[EJobs.WAR]: {
		title: 'Warrior',
		description: 'A master of weapons',
		archetype: ['PS', 'SP'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.BRW]: {
		title: 'Brawler',
		description: '???',
		archetype: ['PS', 'SP'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.HUN]: {
		title: 'Hunter',
		description: '???',
		archetype: ['PS', 'SP'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.WER]: {
		title: 'Werewolf',
		description: 'A feral warrior',
		archetype: ['PS', 'SP'],
		skills: [ESkillSet.LYCANTROPHY]
	},
	[EJobs.BLD]: {
		title: 'Blademaster',
		description: '???',
		archetype: ['PM', 'MP'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.PAL]: {
		title: 'Paladin',
		description: 'A holy guardian',
		archetype: ['PM', 'MP'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.DRK]: {
		title: 'Dark Knight',
		description: 'A knight of darkness',
		archetype: ['PM', 'MP'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.SPL]: {
		title: 'Spellblade',
		description: '???',
		archetype: ['PM', 'MP'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.ROG]: {
		title: 'Rogue',
		description: '???',
		archetype: ['SS'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.RAN]: {
		title: 'Ranger',
		description: 'A ranged weapon specialist',
		archetype: ['SS'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.ENT]: {
		title: 'Entertainer',
		description: '???',
		archetype: ['SS'],
		skills: [ESkillSet.DANCING, ESkillSet.SINGING]
	},
	[EJobs.VMP]: {
		title: 'Vampire',
		description: '???',
		archetype: ['SS'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.TRI]: {
		title: 'Trickster',
		description: '???',
		archetype: ['SM', 'MS'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.MNK]: {
		title: 'Monk',
		description: '???',
		archetype: ['SM', 'MS'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.ASA]: {
		title: 'Assassin',
		description: 'A fighter of shadows',
		archetype: ['SM', 'MS'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.ALC]: {
		title: 'Alchemist',
		description: '???',
		archetype: ['SM', 'MS'],
		skills: [ESkillSet.NONE]
	},
	[EJobs.PSY]: {
		title: 'Psyker',
		description: 'A fighter with strong mental abilites',
		archetype: ['MM'],
		skills: [ESkillSet.MAGIC_KINETIC]
	},
	[EJobs.PRI]: {
		title: 'Priest',
		description: 'A holy magician',
		archetype: ['MM'],
		skills: [ESkillSet.MAGIC_HOLY]
	},
	[EJobs.SOR]: {
		title: 'Sorcerer',
		description: 'A dark magician',
		archetype: ['MM'],
		skills: [ESkillSet.MAGIC_DARK]
	},
	[EJobs.ELM]: {
		title: 'Elemental Mage',
		description: 'A master of elemental magic',
		archetype: ['MM'],
		skills: [ESkillSet.MAGIC_FIRE, ESkillSet.MAGIC_WATER, ESkillSet.MAGIC_AIR, ESkillSet.MAGIC_EARTH]
	}
};

export default Jobs;
