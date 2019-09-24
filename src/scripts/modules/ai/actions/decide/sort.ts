import { ICharacterSnapshot } from 'modules/character';
import { IAction } from 'modules/ai/actions/decide/actions';

export const getCharacterHPRatio = (char: ICharacterSnapshot, damage = 0): number => {
	const hp = char.attributes.HP;
	const hpMax = char.baseAttributes.HP;
	return (hp > damage ? hp - damage : 0) / hpMax;
};

export const byShortestTravel = (actions: IAction[]): IAction[] => {
	return actions.sort((a, b) => a.target.distance - b.target.distance);
};

export const bySafeDistance = (actions: IAction[]): IAction[] => {
	return actions.sort((a, b) => b.closestEnemy - a.closestEnemy);
};

export const byAllyDistance = (actions: IAction[]): IAction[] => {
	return actions.sort((a, b) => a.closestAlly - b.closestAlly);
};

export const byMostHealing = (actions: IAction[]): IAction[] => {
	return actions.sort((a, b) => b.healing - a.healing);
};

export const byMostDamage = (actions: IAction[]): IAction[] => {
	return actions.sort((a, b) => b.damage - a.damage);
};

export const byHPRemaining = (actions: IAction[], withDamage = false): IAction[] => {
	return actions.sort((a, b) => {
		const charA = a.target.character;
		const charB = b.target.character;
		const remainingA = getCharacterHPRatio(charA, withDamage ? a.damage : 0);
		const remainingB = getCharacterHPRatio(charB, withDamage ? b.damage : 0);
		return remainingA - remainingB;
	});	
};
