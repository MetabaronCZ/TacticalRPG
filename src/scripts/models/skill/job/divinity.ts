import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const divinity: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.DIVINITY_NONE, {
		title: 'Divinity',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const divinitySkillset: ISkillset = {
	title: 'Divinity',
	description: '',
	skills: divinity.map(([id, skill]) => id)
};

export default divinity;
