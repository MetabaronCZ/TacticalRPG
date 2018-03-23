import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const airblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.AIRBLADE_WINDSTRIKE, {
		title: 'Windstrike',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.AIRBLADE_AIR_BLAST, {
		title: 'Air Blast',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export const airbladeSkillset: ISkillset = {
	title: 'Airblade',
	description: '',
	skills: airblade.map(([id, skill]) => id)
};

export default airblade;
