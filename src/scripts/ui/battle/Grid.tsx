import React from 'react';

import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Player from 'modules/battle/player';
import { IBattleInfo } from 'modules/battle/battle-info';

import GridBase from 'ui/battle/GridBase';
import GridCharacters from 'ui/battle/GridCharacters';
import GridBattleInfo from 'ui/battle/GridBattleInfo';

interface IGridProps {
	act: Act|null;
	players: Player[];
	characters: Character[];
	battleInfo: IBattleInfo[];
	onTileSelect: (tile: Tile) => void;
}

const Grid: React.SFC<IGridProps> = ({ act, players, characters, battleInfo, onTileSelect }) => {
	const actor = act ? act.getActor() : null;

	return (
		<ul className="Grid">
			<li className="Grid-item">
				<GridBase act={act} onSelect={onTileSelect} />
			</li>

			<li className="Grid-item">
				<GridCharacters actor={actor} characters={characters} players={players} />
			</li>

			<li className="Grid-item">
				<GridBattleInfo info={battleInfo} />
			</li>
		</ul>
	);
};

export default Grid;
