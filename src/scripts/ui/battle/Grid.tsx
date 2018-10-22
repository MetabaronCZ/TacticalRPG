import React from 'react';

import Act from 'modules/battle/act';
import Character from 'modules/character';
import Player from 'modules/battle/player';
import Position from 'modules/geometry/position';

import GridBase from 'ui/battle/GridBase';
import GridCharacters from 'ui/battle/GridCharacters';

interface IGridProps {
	act: Act|null;
	players: Player[];
	characters: Character[];
	onTileSelect: (pos: Position) => void;
}

const Grid: React.SFC<IGridProps> = ({ act, players, characters, onTileSelect }) => {
	const actor = act ? act.getActor() : null;

	return (
		<ul className="Grid">
			<li className="Grid-item">
				<GridBase act={act} onSelect={onTileSelect} />
			</li>

			<li className="Grid-item">
				<GridCharacters actor={actor} characters={characters} players={players} />
			</li>
		</ul>
	);
};

export default Grid;
