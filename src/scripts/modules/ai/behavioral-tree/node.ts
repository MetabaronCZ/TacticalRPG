import { BTData } from 'modules/ai/behavioral-tree';

export type BTNodeStatus = 'SUCCESS' | 'FAILURE' | 'RUNNING';

abstract class BTNode<T extends BTData> {
    public abstract run(data: T): BTNodeStatus;
}

export default BTNode;
