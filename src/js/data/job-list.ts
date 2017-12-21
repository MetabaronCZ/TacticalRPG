import { ArchetypeID as ArchID } from 'models/archetype';
import { JobID, IJob } from 'models/job';
import { SkillSetID } from 'models/skill-set';

const JobList = new Map<JobID, IJob>();

JobList.set(JobID.NONE, {
	title: 'none',
	description: 'No job selected',
	archetype: [],
	skills: []
});

JobList.set(JobID.BAR, {
	title: 'Barbarian',
	description: 'A warrior with extreme strength',
	archetype: [ArchID.PP],
	skills: [SkillSetID.BERSERKING]
});

JobList.set(JobID.KNG, {
	title: 'Knight',
	description: 'A warrior with high endurance',
	archetype: [ArchID.PP],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.DRG, {
	title: 'Dragonkin',
	description: '???',
	archetype: [ArchID.PP],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.CYB, {
	title: 'Cyborg',
	description: '???',
	archetype: [ArchID.PP],
	skills: [SkillSetID.PROGRAM]
});

JobList.set(JobID.WAR, {
	title: 'Warrior',
	description: 'A master of weapons',
	archetype: [ArchID.PS, ArchID.SP],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.BRW, {
	title: 'Brawler',
	description: '???',
	archetype: [ArchID.PS, ArchID.SP],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.HUN, {
	title: 'Hunter',
	description: '???',
	archetype: [ArchID.PS, ArchID.SP],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.WER, {
	title: 'Werewolf',
	description: 'A feral warrior',
	archetype: [ArchID.PS, ArchID.SP],
	skills: [SkillSetID.LYCANTROPHY]
});

JobList.set(JobID.BLD, {
	title: 'Blademaster',
	description: '???',
	archetype: [ArchID.PM, ArchID.MP],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.PAL, {
	title: 'Paladin',
	description: 'A holy guardian',
	archetype: [ArchID.PM, ArchID.MP],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.DRK, {
	title: 'Dark Knight',
	description: 'A knight of darkness',
	archetype: [ArchID.PM, ArchID.MP],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.SPL, {
	title: 'Spellblade',
	description: '???',
	archetype: [ArchID.PM, ArchID.MP],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.ROG, {
	title: 'Rogue',
	description: '???',
	archetype: [ArchID.SS],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.RAN, {
	title: 'Ranger',
	description: 'A ranged weapon specialist',
	archetype: [ArchID.SS],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.ENT, {
	title: 'Entertainer',
	description: '???',
	archetype: [ArchID.SS],
	skills: [SkillSetID.DANCING, SkillSetID.SINGING]
});

JobList.set(JobID.VMP, {
	title: 'Vampire',
	description: '???',
	archetype: [ArchID.SS],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.TRI, {
	title: 'Trickster',
	description: '???',
	archetype: [ArchID.SM, ArchID.MS],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.MNK, {
	title: 'Monk',
	description: '???',
	archetype: [ArchID.SM, ArchID.MS],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.ASA, {
	title: 'Assassin',
	description: 'A fighter of shadows',
	archetype: [ArchID.SM, ArchID.MS],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.ALC, {
	title: 'Alchemist',
	description: '???',
	archetype: [ArchID.SM, ArchID.MS],
	skills: [SkillSetID.NONE]
});

JobList.set(JobID.PSY, {
	title: 'Psyker',
	description: 'A fighter with strong mental abilites',
	archetype: [ArchID.MM],
	skills: [SkillSetID.MAGIC_KINETIC]
});

JobList.set(JobID.PRI, {
	title: 'Priest',
	description: 'A holy magician',
	archetype: [ArchID.MM],
	skills: [SkillSetID.MAGIC_HOLY]
});

JobList.set(JobID.SOR, {
	title: 'Sorcerer',
	description: 'A dark magician',
	archetype: [ArchID.MM],
	skills: [SkillSetID.MAGIC_DARK]
});

JobList.set(JobID.ELM, {
	title: 'Elemental Mage',
	description: 'A master of elemental magic',
	archetype: [ArchID.MM],
	skills: [SkillSetID.MAGIC_FIRE, SkillSetID.MAGIC_WATER, SkillSetID.MAGIC_AIR, SkillSetID.MAGIC_EARTH]
});

export default JobList;
