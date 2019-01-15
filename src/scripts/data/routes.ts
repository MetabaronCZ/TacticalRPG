import { RouteID } from 'modules/route';

export type Paths = {
	[id in RouteID]: string;
};

export const paths: Paths = {
	ROOT: '/',
	BATTLE_CONFIG: '/battle-config',
	BATTLE: '/battle',
	BATTLE_SUMMARY: '/battle-summary',
	PARTY_LIST: '/party-list',
	PARTY_EDIT: '/party-edit/:id',
	PARTY_CREATE: '/party-create',
	CHARACTER_LIST: '/character-list',
	CHARACTER_EDIT: '/character-edit/:id',
	CHARACTER_CREATE: '/character-create'
};

export default paths;
