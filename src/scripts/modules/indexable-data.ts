import uuid from 'uuid/v1';

export interface IIndexableData {
	readonly id: string;
	readonly creationDate: number;
	readonly lastUpdate: number;
}

export class IndexableData {
	public readonly id: string;
	public readonly creationDate: number;
	protected lastUpdate: number;

	constructor(conf: Partial<IIndexableData> = {}) {
		const now = Date.now();
		this.id = conf.id || uuid();
		this.creationDate = conf.creationDate || now;
		this.lastUpdate = conf.lastUpdate || now;
	}

	public update(): void {
		this.lastUpdate = Date.now();
	}

	public serialize(): IIndexableData {
		return {
			id: this.id,
			creationDate: this.creationDate,
			lastUpdate: this.lastUpdate
		};
	}
}
