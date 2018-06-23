import { WeaponSkillID } from 'modules/skill/weapon/types';
import { MagicSkillID } from 'modules/skill/magic/types';

export enum ActionID {
	ATTACK = 'ATTACK',
	DOUBLE_ATTACK = 'DOUBLE_ATTACK',
	WEAPON = 'WEAPON',
	MAGIC = 'MAGIC',
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
	readonly skills?: WeaponSkillID[] | MagicSkillID[];
}

export type IActions = IActionItem[];
