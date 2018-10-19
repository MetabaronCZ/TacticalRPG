import React from 'react';

import Act from 'modules/battle/act';
import Character from 'modules/character';
import Player from 'modules/battle/player';
import Position from 'modules/battle/position';

import GridBase from 'ui/battle/GridBase';
import GridCharacters from 'ui/battle/GridCharacters';

const gridWidth = 400;

export interface IPlayerColors {
	player: number;
	colorA: string;
	colorB: string;
}

interface IGridProps {
	act: Act|null;
	players: Player[];
	characters: Character[];
	onTileSelect: (pos: Position) => void;
}

const Grid: React.SFC<IGridProps> = ({ act, players, characters, onTileSelect }) => {
	const playerColors: IPlayerColors[] = players.map((pl, p) => ({
		player: p,
		colorA: 0 === p ? 'darkorchid' : 'salmon',
		colorB: 0 === p ? 'darkviolet' : 'tomato'
	}));

	const actor = act ? act.getActor() : null;

	return (
		<div style={{ position: 'relative', width: gridWidth + 'px', height: gridWidth + 'px', cursor: 'pointer', }}>
			<GridBase act={act} onSelect={onTileSelect} />
			<GridCharacters actor={actor} characters={characters} colors={playerColors} />
		</div>
	);
};

export default Grid;
