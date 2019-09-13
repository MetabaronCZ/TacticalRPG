import { BTData } from 'modules/ai/behavioral-tree';
import BTNode, { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

export type BTNodeHandler<T extends BTData> = (data: T) => BTNodeStatus;

class BTError<T extends BTData> extends BTNode<T> {
	private message: string;

	constructor(message: string) {
		super();
		this.message = message;
	}

	public run(): BTNodeStatus {
		throw new Error(this.message);
	}
}

export default BTError;
