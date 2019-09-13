import { BTData } from 'modules/ai/behavioral-tree';
import BTNode, { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

export type BTNodeHandler<T extends BTData> = (data: T) => BTNodeStatus;

class BTAction<T extends BTData> extends BTNode<T> {
	private handler: BTNodeHandler<T>;

	constructor(handler: BTNodeHandler<T>) {
		super();
		this.handler = handler;
	}

	public run(data: T): BTNodeStatus {
		return this.handler(data);
	}
}

export default BTAction;
