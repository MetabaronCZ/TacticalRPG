import { ICharacterSnapshot } from 'modules/character';
import { IAction } from 'modules/ai/actions/decide/actions';

export const getCharacterHPRatio = (char: ICharacterSnapshot, damage = 0): number => {
	const hp = char.attributes.HP;
	const hpMax = char.baseAttributes.HP;
	return (hp > damage ? hp - damage : 0) / hpMax;
};

type SortType =
	'SHORTEST_TRAVEL' | 'SAFE_DISTANCE' | 'ALLY_DISTANCE' | 'CLOSEST_TO' |
	'MOST_HEALING' | 'MOST_DAMAGE' | 'HP_REMAINING';
type SortResult = -1 | 0 | 1;

type SortTable = {
	[type in SortType]: (a: IAction, b: IAction, param: any) => SortResult;
};

const sortTable: SortTable = {
	SHORTEST_TRAVEL: (a, b) => {
		if (a.target.distance < b.target.distance) return -1;
		if (a.target.distance > b.target.distance) return +1;
		return 0;
	},
	SAFE_DISTANCE: (a, b) => {
		if (b.closestEnemy < a.closestEnemy) return -1;
		if (b.closestEnemy > a.closestEnemy) return +1;
		return 0;
	},
	ALLY_DISTANCE: (a, b) => {
		if (a.closestAlly < b.closestAlly) return -1;
		if (a.closestAlly > b.closestAlly) return +1;
		return 0;
	},
	CLOSEST_TO: (a, b, param) => {
		const targetID = param + '';
		const distA = a.distances[targetID] || 0;
		const distB = b.distances[targetID] || 0;
		if (distA < distB) return -1;
		if (distA > distB) return +1;
		return 0;
	},
	MOST_HEALING: (a, b) => {
		if (b.healing < a.healing) return -1;
		if (b.healing > a.healing) return +1;
		return 0;
	},
	MOST_DAMAGE: (a, b) => {
		if (b.damage < a.damage) return -1;
		if (b.damage > a.damage) return +1;
		return 0;
	},
	HP_REMAINING: (a, b, param) => {
		const withDamage = !!param;
		const charA = a.target.character;
		const charB = b.target.character;
		const remainingA = getCharacterHPRatio(charA, withDamage ? a.damage : 0);
		const remainingB = getCharacterHPRatio(charB, withDamage ? b.damage : 0);
		if (remainingA < remainingB) return -1;
		if (remainingA > remainingB) return +1;
		return 0;
	}
};

export const sortActions = (actions: IAction[], sort: SortType[], params: any[] = []): IAction[] => {
	if (!sort.length || !actions.length) {
		return actions;
	}
	return actions.sort((a, b) => {
		for (let s = 0, smax = sort.length; s < smax; s++) {
			const sortType = sort[s];
			const sorted = sortTable[sortType](a, b, params[s]);

			if (0 !== sorted) {
				return sorted;
			}
		}
		return 0;
	});
};
