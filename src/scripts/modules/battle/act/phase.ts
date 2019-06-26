import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import CharacterAction from 'modules/battle/character-action';

abstract class ActPhase<T> {
	public abstract getActor(): Character | null;
	public abstract selectTile(tile: Tile): void;
	public abstract selectAction(action: CharacterAction): void;
	public abstract serialize(): T;
}

export default ActPhase;
