import BTree from 'modules/ai/behavioral-tree/tree';
import BTError from 'modules/ai/behavioral-tree/error';
import BTInvert from 'modules/ai/behavioral-tree/invert';
import BTRepeat from 'modules/ai/behavioral-tree/repeat';
import BTSucceed from 'modules/ai/behavioral-tree/succeed';
import BTSelector from 'modules/ai/behavioral-tree/selector';
import BTSequence from 'modules/ai/behavioral-tree/sequence';
import BTRepeatUntil from 'modules/ai/behavioral-tree/repeat-until';
import BTNode, { BTNodeStatus } from 'modules/ai/behavioral-tree/node';
import BTAction, { BTNodeHandler } from 'modules/ai/behavioral-tree/action';

export type BTData = {};

abstract class BT {
	public static Tree<T extends BTData>(root?: BTNode<T>): BTree<T> {
		return new BTree<T>(root);
	}

	public static Selector<T extends BTData>(nodes: BTNode<T>[]): BTSelector<T> {
		return new BTSelector<T>(nodes, false);
	}

	public static RandomSelector<T extends BTData>(nodes: BTNode<T>[]): BTSelector<T> {
		return new BTSelector<T>(nodes, true);
	}

	public static Sequence<T extends BTData>(nodes: BTNode<T>[]): BTSequence<T> {
		return new BTSequence<T>(nodes, false);
	}

	public static RandomSequence<T extends BTData>(nodes: BTNode<T>[]): BTSequence<T> {
		return new BTSequence<T>(nodes, true);
	}

	public static Action<T extends BTData>(handler: BTNodeHandler<T>): BTAction<T> {
		return new BTAction<T>(handler);
	}

	public static Invert<T extends BTData>(node: BTNode<T>): BTInvert<T> {
		return new BTInvert<T>(node);
	}

	public static Succeed<T extends BTData>(node: BTNode<T>): BTSucceed<T> {
		return new BTSucceed<T>(node);
	}

	public static Repeat<T extends BTData>(max: number, node: BTNode<T>): BTRepeat<T> {
		return new BTRepeat<T>(node, max);
	}

	public static RepeatUntil<T extends BTData>(status: BTNodeStatus, node: BTNode<T>): BTRepeatUntil<T> {
		return new BTRepeatUntil<T>(node, status);
	}

	public static Error<T extends BTData>(message: string): BTError<T> {
		return new BTError<T>(message);
	}
}

export default BT;
