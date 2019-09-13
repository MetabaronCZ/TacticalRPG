import { BTData } from 'modules/ai/behavioral-tree';
import BTNode, { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

class BTree<T extends BTData> extends BTNode<T> {
	private node: BTNode<T> | null;

	constructor(node?: BTNode<T>) {
		super();
		this.node = node || null;
	}

	public run(data: T): BTNodeStatus {
		return this.node ? this.node.run(data) : 'SUCCESS';
	}
}

export default BTree;
