import { IChronoxRecord } from 'modules/battle/chronox';

const KEY = 'chronox';

export interface ISummary {
	readonly chronox: IChronoxRecord;
	readonly winner: number | null;
}

class Summary {
	public static load(): ISummary {
		const data = sessionStorage.getItem(KEY);

		if (!data) {
			throw new Error('Could not load Summary data!');
		}
		try {
			return JSON.parse(data) as ISummary;
		} catch (err) {
			throw new Error('Invalid saved summary data!');
		}
	}

	public static save(chronox: IChronoxRecord, winner: number | null): void {
		const record: ISummary = { chronox, winner };
		sessionStorage.setItem(KEY, JSON.stringify(record));
	}
}

export default Summary;
