import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const thunderMagic: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.THUNDER_MAGIC_THUNDERBOLT, {
		title: 'Thunderbolt',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.THUNDER_MAGIC_SHOCK, {
		title: 'Shock',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.THUNDER_MAGIC_THUNDERSTORM, {
		title: 'Thunderstorm',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.THUNDER_MAGIC_THUNDER_AURA, {
		title: 'Thunder Aura',
		type: SKillType.ACTIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		usage: SkillUsage.SPECIAL
	}]
];

export const thunderMagicSkillset: ISkillset = {
	title: 'Thunder Magic',
	description: '',
	skills: thunderMagic.map(([id, skill]) => id)
};

export default thunderMagic;
