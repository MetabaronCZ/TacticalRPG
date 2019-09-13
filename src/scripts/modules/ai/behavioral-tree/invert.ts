import { BTData } from 'modules/ai/behavioral-tree';
import BTDecorator from 'modules/ai/behavioral-tree/decorator';
import { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

class BTInvert<T extends BTData> extends BTDecorator<T> {
	public run(data: T): BTNodeStatus {
		const status = this.node.run(data);

		if ('SUCCESS' === status) {
			return 'FAILURE';
		}
		if ('FAILURE' === status) {
			return 'SUCCESS';
		}
		return 'RUNNING';
	}
}

export default BTInvert;
