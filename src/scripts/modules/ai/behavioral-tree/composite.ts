import { BTData } from 'modules/ai/behavioral-tree';
import BTNode from 'modules/ai/behavioral-tree/node';

abstract class BTComposite<T extends BTData> extends BTNode<T> {
	protected readonly children: BTNode<T>[];
	protected readonly random: boolean;

	constructor(nodes: BTNode<T>[] = [], random = false) {
		super();
		this.children = nodes;
		this.random = random;
	}
}

export default BTComposite;
