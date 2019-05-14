export type IcoID = 'default' |
	'back' | 'next' | 'up' | 'down' |
	'create' | 'destroy' | 'fight' |
	'female' | 'male' |
	'success';

type IIcos = {
	readonly [id in IcoID]: string | null;
};

export const Icos: IIcos = {
	default: null,
	back: '‹',
	next: '›',
	up: '↑',
	down: '↓',
	create: '+',
	destroy: '-',
	fight: '⚔',
	female: '♀',
	male: '♂',
	success: '✔'
};
