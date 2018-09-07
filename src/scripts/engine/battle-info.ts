import Position from 'engine/position';

class BattleInfo {
	private readonly text: string;
	private readonly position: Position;

	constructor(text: string, position: Position) {
		this.text = text;
		this.position = position;
	}

	public getText(): string {
		return this.text;
	}

	public getPosition(): Position {
		return this.position;
	}
}

export default BattleInfo;
