import React from 'react';

import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { IBattleInfo } from 'modules/battle/battle-info';

import GridBase from 'ui/battle/GridBase';
import GridCharacters from 'ui/battle/GridCharacters';
import GridBattleInfo from 'ui/battle/GridBattleInfo';

interface IGridProps {
	readonly act: Act;
	readonly characters: Character[];
	readonly battleInfo: IBattleInfo[];
	readonly onTileSelect: (tile: Tile) => void;
}

const Grid: React.SFC<IGridProps> = ({ act, characters, battleInfo, onTileSelect }) => {
	const { actor } = act;
	return (
		<ul className="Grid">
			<li className="Grid-item">
				<GridBase act={act} characters={characters} onSelect={onTileSelect} />
			</li>

			<li className="Grid-item">
				<GridCharacters actor={actor} characters={characters} />
			</li>

			<li className="Grid-item">
				<GridBattleInfo info={battleInfo} />
			</li>
		</ul>
	);
};

export default Grid;
