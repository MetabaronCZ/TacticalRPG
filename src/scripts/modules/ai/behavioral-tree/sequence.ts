import { getRandomized } from 'core/array';

import { BTData } from 'modules/ai/behavioral-tree';
import BTComposite from 'modules/ai/behavioral-tree/composite';
import { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

class BTSequence<T extends BTData> extends BTComposite<T> {
	public run(data: T): BTNodeStatus {
		const nodes = (this.random ? getRandomized(this.children) : this.children);

		for (const node of nodes) {
			const status = node.run(data);

			if ('SUCCESS' !== status) {
				return status;
			}
		}
		return 'SUCCESS';
	}
}

export default BTSequence;
