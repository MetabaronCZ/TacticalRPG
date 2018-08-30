import { SkillID } from 'modules/skill/types';

export enum ActionID {
	ATTACK = 'ATTACK',
	DOUBLE_ATTACK = 'DOUBLE_ATTACK',
	WEAPON = 'WEAPON',
	MAGIC = 'MAGIC',
	PASS = 'PASS',
	REACTION = 'REACTION',
	DONT_REACT = 'DONT_REACT',
	DIRECT	 = 'DIRECT',
	CONFIRM = 'CONFIRM',
	BACK = 'BACK'
}

export interface IActionItem {
	readonly id: ActionID;
	readonly cost: number;
	readonly title: string;
	readonly active: boolean;
	readonly skills: SkillID[];
}

export type IActions = IActionItem[];
