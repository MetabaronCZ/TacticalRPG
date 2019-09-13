import { BTData } from 'modules/ai/behavioral-tree';
import BTNode from 'modules/ai/behavioral-tree/node';

abstract class BTDecorator<T extends BTData> extends BTNode<T> {
	protected node: BTNode<T>;

	constructor(node: BTNode<T>) {
		super();
		this.node = node;
	}
}

export default BTDecorator;
