export interface IScore {
	points: number;
}

export class Score {
	public static getDefault(): IScore {
		return {
			points: 0
		};
	}
}
