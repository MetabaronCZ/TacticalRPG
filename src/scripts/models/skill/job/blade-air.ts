import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const airblade: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.AIRBLADE_WINDSTRIKE, {
		title: 'Windstrike',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.WIND,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}],
	[JobSKillID.AIRBLADE_AIR_BLAST, {
		title: 'Air Blast',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.WIND,
		physicalDamage: 0.5,
		elementalDamage: 1,
		status: []
	}]
];

export const airbladeSkillset: ISkillset = {
	title: 'Airblade',
	description: '',
	skills: airblade.map(([id, skill]) => id)
};

export default airblade;
