import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const stoneblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.STONEBLADE_EARTHSTRIKE, {
		title: 'Earthstrike',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.STONEBLADE_BOULDER, {
		title: 'Boulder',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export const stonebladeSkillset: ISkillset = {
	title: 'Stoneblade',
	description: '',
	skills: stoneblade.map(([id, skill]) => id)
};

export default stoneblade;
