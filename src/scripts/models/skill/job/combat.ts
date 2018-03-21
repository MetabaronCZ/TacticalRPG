import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const combat: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.COMBAT_NONE, {
		title: 'Combat',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const combatSkills = combat.map(([id, skill]) => id);
export default combat;
