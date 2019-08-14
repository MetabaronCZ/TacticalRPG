import { Color } from 'modules/color';

abstract class Sprite<T> {
	public readonly self: T;

	constructor(character: T) {
		this.self = character;
	}

	public abstract render(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, ...style: Color[]): void;
}

export default Sprite;
