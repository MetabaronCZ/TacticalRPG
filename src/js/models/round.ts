import { IOrder } from 'models/order';

export interface IRound {
	number: number;
}

export class Round {
	public static init(order: IOrder): IRound {
		return {
			number: 1
		};
	}
}
