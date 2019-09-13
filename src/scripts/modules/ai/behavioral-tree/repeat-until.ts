import { BTData } from 'modules/ai/behavioral-tree';
import BTDecorator from 'modules/ai/behavioral-tree/decorator';
import BTNode, { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

class BTRepeatUntil<T extends BTData> extends BTDecorator<T> {
	private status: BTNodeStatus;

	constructor(node: BTNode<T>, status: BTNodeStatus) {
		super(node);
		this.status = status;
	}

	public run(data: T): BTNodeStatus {
		const expected = this.status;
		let status = this.node.run(data);

		while (status !== expected) {
			status = this.node.run(data);
		}
		return status;
	}
}

export default BTRepeatUntil;
