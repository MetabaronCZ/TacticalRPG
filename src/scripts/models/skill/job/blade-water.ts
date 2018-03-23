import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const waterblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WATERBLADE_WATERSTRIKE, {
		title: 'Waterstrike',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[JobSKillID.WATERBLADE_SPLASH, {
		title: 'Splash',
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export const waterbladeSkillset: ISkillset = {
	title: 'Waterblade',
	description: '',
	skills: waterblade.map(([id, skill]) => id)
};

export default waterblade;
