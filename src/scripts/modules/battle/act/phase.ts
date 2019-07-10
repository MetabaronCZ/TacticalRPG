import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';

abstract class ActPhase<T> {
	public abstract getActor(): Character | null;
	public abstract selectTile(tile: Tile): void;
	public abstract selectCommand(command: Command): void;
	public abstract serialize(): T;
}

export default ActPhase;
