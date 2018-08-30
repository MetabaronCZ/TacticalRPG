import { IActionItem, ActionID } from 'modules/character-action/types';

const dontReactAction = (): IActionItem => ({
	id: ActionID.DONT_REACT,
	cost: 0,
	title: 'Pass',
	active: true,
	skills: []
});

const confirmAction = (title = 'Confirm', cost = 0): IActionItem => ({
	id: ActionID.CONFIRM,
	cost,
	title,
	active: true,
	skills: []
});

const directAction = (): IActionItem => ({
	id: ActionID.DIRECT,
	cost: 0,
	title: 'Direct',
	active: true,
	skills: []
});

const backAction = (): IActionItem => ({
	id: ActionID.BACK,
	cost: 0,
	title: 'Back',
	active: true,
	skills: []
});

const passAction = (): IActionItem => ({
	id: ActionID.PASS,
	cost: 0,
	title: 'End turn',
	active: true,
	skills: []
});

const CharacterAction = {
	dontReactAction,
	confirmAction,
	directAction,
	backAction,
	passAction
};

export default CharacterAction;
