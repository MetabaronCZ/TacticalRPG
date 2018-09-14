import React from 'react';

import Act from 'engine/act';
import Player from 'engine/player';
import Position from 'engine/position';
import Character from 'engine/character';

import GridBase from 'components/Game/components/Debug/GridBase';
import GridCharacters from 'components/Game/components/Debug/GridCharacters';

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
