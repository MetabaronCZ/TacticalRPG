export interface IScore {
	points: number;
}

const getDefault = (): IScore => {
	return {
		points: 0
	};
};

export const Score = {
	getDefault
};
