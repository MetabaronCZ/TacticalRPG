import DataList from 'core/data-list';
import { MagicSkillID } from 'modules/skill/magic/types';
import { WeaponSkillID } from 'modules/skill/weapon/types';
import { IActionItem, ActionID } from 'modules/character-action/types';

type IActionItemGetter = (title?: string, cost?: number, active?: boolean, skills?: WeaponSkillID[] | MagicSkillID[]) => IActionItem;

const CharacterActions = new DataList<ActionID, IActionItemGetter>({
	[ActionID.ATTACK]: (title = 'Attack', cost = 0, active = true, skills = []) => ({
		id: ActionID.ATTACK,
		cost,
		title,
		active,
		skills
	}),
	[ActionID.DOUBLE_ATTACK]: (title, cost = 0, active = true, skills = []) => ({
		id: ActionID.DOUBLE_ATTACK,
		cost,
		title: 'Double Attack',
		active,
		skills
	}),
	[ActionID.WEAPON]: (title = 'Weapon Skill', cost = 0, active = true, skills = []) => ({
		id: ActionID.WEAPON,
		cost,
		title,
		active,
		skills
	}),
	[ActionID.MAGIC]: (title = 'Magic Skill', cost = 0, active = true, skills = []) => ({
		id: ActionID.MAGIC,
		cost,
		title,
		active,
		skills
	}),
	[ActionID.PASS]: () => ({
		id: ActionID.PASS,
		cost: 0,
		title: 'End turn',
		active: true
	}),
	[ActionID.DIRECT]: () => ({
		id: ActionID.DIRECT,
		cost: 0,
		title: 'Direct',
		active: true
	}),
	[ActionID.CONFIRM]: (title = 'Confirm', cost = 0) => ({
		id: ActionID.CONFIRM,
		cost,
		title,
		active: true
	}),
	[ActionID.BACK]: () => ({
		id: ActionID.BACK,
		cost: 0,
		title: 'Back',
		active: true
	})
});

export default CharacterActions;
