import { IAction } from 'store';
import { IRound, Round } from 'models/round';

const round = (state = Round.getDefault(), action: IAction): IRound => {
	return state;
};

export default round;
