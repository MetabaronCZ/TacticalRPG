import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const flameblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.FLAMEBLADE_FLAMESTRIKE, {
		title: 'Flamestrike',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.FLAMEBLADE_FIREBALL, {
		title: 'Fireball',
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export const flamebladeSkillset: ISkillset = {
	title: 'Flameblade',
	description: '',
	skills: flameblade.map(([id, skill]) => id)
};

export default flameblade;
