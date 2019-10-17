import { ISkillData } from 'modules/skill/skill-data';
import { HolyMagicSkillID } from 'modules/skill/magic';

const holyMagic: { [id in HolyMagicSkillID]: ISkillData; } = {
	HOL_HEAL: {
		title: 'Heal',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		cost: {
			MP: 10
		},
		healing: {
			modifier: 1
		},
		animation: {
			duration: 1000
		}
	},
	HOL_REMEDY: {
		title: 'Remedy',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		cost: {
			MP: 10
		},
		healing: {
			modifier: 0
		},
		animation: {
			duration: 1000
		}
	},
	HOL_REGENERATE: {
		title: 'Regenerate',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		status: ['REGEN'],
		cooldown: 1,
		cost: {
			MP: 10
		},
		healing: {
			modifier: 0.5
		},
		animation: {
			duration: 1000
		}
	},
	HOL_GROUP_HEAL: {
		title: 'Group Heal',
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ALLY',
		cooldown: 2,
		cost: {
			MP: 20
		},
		healing: {
			modifier: 0.5
		},
		animation: {
			duration: 1000
		}
	},
	HOL_REVIVE: {
		title: 'Revive',
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		cooldown: 'ULTIMATE',
		cost: {
			MP: 20
		},
		healing: {
			modifier: 0
		},
		animation: {
			duration: 1000
		}
	}
};

export default holyMagic;
