import Animation from 'core/animation';
import { tileAnimationDuration } from 'data/game-config';

import Tile from 'modules/geometry/tile';

type OnUpdate = (isLast: boolean) => void;
type TileAnimationType = 'HIGHLIGHT' | 'DESTROY';

class TileAnimation extends Animation<TileAnimationType> {
	public readonly tiles: Tile[];

	constructor(type: TileAnimationType, tiles: Tile[], onUpdate: OnUpdate) {
		super(type, tileAnimationDuration, onUpdate);
		this.tiles = tiles;
	}
}

export default TileAnimation;
