import { IAIData } from 'modules/ai/character';
import BTNode, { BTNodeStatus } from 'modules/ai/behavioral-tree/node';

type BTPhaseNodes<T extends string> = {
	readonly [phase in T]: BTNode<IAIData> | null;
};

type BTPhaseGetter<T> = (data: IAIData) => T;

class BTPhaseSelector<U extends string | null> extends BTNode<IAIData> {
	private nodes: BTPhaseNodes<Exclude<U, null>>;
	private getter: BTPhaseGetter<U>;

	constructor(getter: BTPhaseGetter<U>, nodes: BTPhaseNodes<Exclude<U, null>>) {
		super();
		this.getter = getter;
		this.nodes = nodes;
	}

	public run(data: IAIData): BTNodeStatus {
		const phase = this.getter(data);

		if (null !== phase) {
			const p = phase as Exclude<U, null>;
			const node = this.nodes[p];

			if (node) {
				return node.run(data);
			}
		}
		return 'SUCCESS';
	}
}

export default BTPhaseSelector;
