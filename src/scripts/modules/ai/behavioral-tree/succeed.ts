import { BTData } from 'modules/ai/behavioral-tree';
import BTDecorator from 'modules/ai/behavioral-tree/decorator';
import { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

class BTSucceed<T extends BTData> extends BTDecorator<T> {
	public run(data: T): BTNodeStatus {
		this.node.run(data);
		return 'SUCCESS';
	}
}

export default BTSucceed;
