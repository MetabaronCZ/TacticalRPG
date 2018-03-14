export interface IScore {
	points: number;
}

export class Score {
	public static init(): IScore {
		return {
			points: 0
		};
	}
}
