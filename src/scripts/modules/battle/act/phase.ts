import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';

abstract class ActPhase<T, U> {
	public abstract readonly actor: Character | null;
	protected info = '';

	public getInfo(): string {
		return this.info;
	}
	public abstract selectTile(tile: Tile): void;
	public abstract selectCommand(command: Command): void;
	public abstract serialize(): T;
	public abstract getRecord(): U;
}

export default ActPhase;
