import { ElementID } from 'modules/skill/affinity';

type ElementDataTable = {
	readonly [id in ElementID]: {
		readonly title: string;
	};
};

const elements: ElementDataTable = {
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
	KINETIC: {
		title: 'Psychokinesis'
	}
};

export default elements;
