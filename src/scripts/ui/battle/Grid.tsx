import React from 'react';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { IActState } from 'modules/battle/act';
import { IBattleInfo } from 'modules/battle/battle-info';

import GridBase from 'ui/battle/GridBase';
import GridCharacters from 'ui/battle/GridCharacters';
import GridBattleInfo from 'ui/battle/GridBattleInfo';

interface IGridProps {
	readonly act: IActState;
	readonly characters: Character[];
	readonly battleInfo: IBattleInfo[];
	readonly onTileSelect: (tile: Tile) => void;
}

const Grid: React.SFC<IGridProps> = ({ act, characters, battleInfo, onTileSelect }) => (
	<ul className="Grid">
		<li className="Grid-item">
			<GridBase act={act} characters={characters} onSelect={onTileSelect} />
		</li>

		<li className="Grid-item">
			<GridCharacters actor={act.actor} characters={characters} />
		</li>

		<li className="Grid-item">
			<GridBattleInfo info={battleInfo} />
		</li>
	</ul>
);

export default Grid;
