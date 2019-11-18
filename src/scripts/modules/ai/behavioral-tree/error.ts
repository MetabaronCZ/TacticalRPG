import { BTData } from 'modules/ai/behavioral-tree';
import BTNode, { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

class BTError<T extends BTData> extends BTNode<T> {
	private readonly message: string;

	constructor(message: string) {
		super();
		this.message = message;
	}

	public run(): BTNodeStatus {
		throw new Error(this.message);
	}
}

export default BTError;
