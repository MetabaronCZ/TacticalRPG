interface IIcos {
	readonly [name: string]: string|null;
}

const Icos: IIcos = {
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

export default Icos;
