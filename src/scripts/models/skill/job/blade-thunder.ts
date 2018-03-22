import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const thunderBlade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.THUNDERBLADE_THUNDERSTRIKE, {
		title: 'Thunderstrike',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.THUNDERBLADE_THUNDREBOLT, {
		title: 'Thunderbolt',
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export const thunderBladeSkills = thunderBlade.map(([id, skill]) => id);
export default thunderBlade;
