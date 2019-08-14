import paths from 'data/routes';

export type RouteID =
	'ROOT' |
	'BATTLE_CONFIG' |
	'BATTLE' |
	'BATTLE_SUMMARY' |
	'PARTY_LIST' |
	'PARTY_EDIT' |
	'PARTY_CREATE' |
	'CHARACTER_LIST' |
	'CHARACTER_EDIT' |
	'CHARACTER_CREATE';

export interface IRouteParams {
	id: string;
}

export const getPath = (route: RouteID, param = ''): string => {
	if (param) {
		return paths[route].replace(':id', param);
	} else {
		return paths[route];
	}
};
