export interface IRound {
	number: number;
}

export class Round {
	public static getDefault() {
		return {
			number: 1
		};
	}
}
