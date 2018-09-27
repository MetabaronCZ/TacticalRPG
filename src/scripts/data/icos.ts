export type IcoID = 'default' |
	'back' | 'next' | 'up' | 'down' |
	'create' | 'destroy' | 'fight' |
	'female' | 'male' |
	'success';

type IIcos<T extends string> = {
	readonly [id in T]: string|null;
};

export const Icos: IIcos<IcoID> = {
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
