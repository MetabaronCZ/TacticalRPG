import Character from 'modules/character';
import { IScore } from 'modules/character/score';
import { IChronoxRecord } from 'modules/battle/chronox';

const KEY = 'chronox';

export interface IScoreRecord {
	[id: string]: IScore;
}

export interface ISummary {
	chronox: IChronoxRecord;
	score: IScoreRecord;
	winner: number;
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

	public static save(chronox: IChronoxRecord, characters: Character[], winner: number) {
		const score: IScoreRecord = {};

		for (const char of characters) {
			score[char.data.id] = char.score.serialize();
		}
		const record: ISummary = { chronox, score, winner };
		sessionStorage.setItem(KEY, JSON.stringify(record));
	}
}

export default Summary;
