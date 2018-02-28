import uuid from 'uuid/v1';

export class ID {
	public static isEqual(id1: ID, id2: ID): boolean {
		return id1.get() === id2.get();
	}

	private readonly id: string;

	constructor(id = uuid()) {
		this.id = id;
	}

	public get(): string {
		return this.id;
	}
}
