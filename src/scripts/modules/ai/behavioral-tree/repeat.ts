import { BTData } from 'modules/ai/behavioral-tree';
import BTDecorator from 'modules/ai/behavioral-tree/decorator';
import BTNode, { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

class BTRepeat<T extends BTData> extends BTDecorator<T> {
	private max: number;

	constructor(node: BTNode<T>, max: number) {
		super(node);
		this.max = max;
	}

	public run(data: T): BTNodeStatus {
		let counter = this.max;
		let status: BTNodeStatus = 'SUCCESS';

		while (counter--) {
			status = this.node.run(data);
		}            
		return status;
	}
}

export default BTRepeat;
