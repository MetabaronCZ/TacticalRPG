import { SkillElement } from 'modules/skill/skill-data';

type ElementDataTable = {
	[id in SkillElement]: {
		title: string;
	};
};

const elements: ElementDataTable = {
	NONE: {
		title: 'none'
	},
	FIRE: {
		title: 'Fire element'
	},
	WATER: {
		title: 'Water element'
	},
	EARTH: {
		title: 'Earth element'
	},
	WIND: {
		title: 'Wind element'
	},
	THUNDER: {
		title: 'Thunder element'
	},
	ICE: {
		title: 'Ice element'
	},
	HOLY: {
		title: 'Holy element'
	},
	DARK: {
		title: 'Dark element'
	},
	PSYCHIC: {
		title: 'Psychokinesis'
	}
};

export default elements;
