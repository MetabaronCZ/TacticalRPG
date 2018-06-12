import { WeaponSkillID } from 'modules/skill/weapon/id';
import { JobSkillID } from 'modules/skill/job/id';

export enum ActionID {
	ATTACK = 'ATTACK',
	DOUBLE_ATTACK = 'DOUBLE_ATTACK',
	WEAPON = 'WEAPON',
	JOB = 'JOB',
	PASS = 'PASS',
	DIRECT	 = 'DIRECT',
	CONFIRM = 'CONFIRM',
	BACK = 'BACK'
}

export interface IActionItem {
	readonly id: ActionID;
	readonly cost: number;
	readonly title: string;
	readonly active: boolean;
	readonly skills?: WeaponSkillID[] | JobSkillID[];
}

export type IActions = IActionItem[];

export const passAction: IActionItem = {
	id: ActionID.PASS,
	cost: 0,
	title: 'End turn',
	active: true
};

export const confirmAction = (skillName: string, cost: number): IActionItem => ({
	id: ActionID.CONFIRM,
	cost,
	title: skillName,
	active: true
});

export const backAction: IActionItem = {
	id: ActionID.BACK,
	cost: 0,
	title: 'Back',
	active: true
};

export const directAction: IActionItem = {
	id: ActionID.DIRECT,
	cost: 0,
	title: 'Direct',
	active: true
};
