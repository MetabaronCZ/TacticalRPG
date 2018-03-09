import { IAction } from 'store';
import { IRound } from 'models/round';

export const initialState: IRound = {
	number: 1
};

const round = (state = initialState, action: IAction): IRound => {
	return state;
};

export default round;
