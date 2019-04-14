import { IActRecord } from 'modules/battle/act';

class Chronox {
	private readonly records: IActRecord[] = [];

	public store(record: IActRecord) {
		this.records.push(record);
	}

	public serialize(): IActRecord[] {
		return this.records;
	}
}

export default Chronox;
