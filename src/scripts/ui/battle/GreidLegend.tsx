import React from 'react';

import Act from 'modules/battle/act';
import Player from 'modules/battle/player';
import { getTiles } from 'modules/geometry/tiles';

import { getTileType, TileType } from 'ui/battle/GridBase';
import { getUniqueItems } from 'core/array';

const tileList = getTiles();

interface IProps {
	act: Act;
	players: Player[];
}

type TileTypeData = {
	[type in TileType]: string;
};

const tileTypeData: TileTypeData = {
	default: '',
	movable: 'Movable tile',
	movePath: 'Move path',
	moveTarget: 'Move target',
	commandRange: 'Skill range',
	commandTargetable: 'Targetable tile',
	commandEffectArea: 'Skill effect area',
	commandEffectTarget: 'Skill target',
	commandEffectTargets: 'Skill effect target',
	reactor: 'Reacting character',
	reactors: 'Skill effect target',
	reactionEvasible: 'Evasible tile',
	directable: 'Directable tile',
	directTarget: 'Direction target'
};

const GridLegend: React.SFC<IProps> = ({ act, players }) => {
	const tiles: TileType[] = tileList.map(tile => getTileType(tile, act));

	const types = getUniqueItems(tiles)
		.filter(t => 'default' !== t)
		.sort();

	return (
		<div className="GridLegend">
			<div>
				<strong>Legend:</strong>
			</div>

			<ul className="GridLegend-list">
				{players.map(pl => (
					<div className="GridLegend-list-item" key={pl.id}>
						<span className={`GridLegend-ico GridLegend-ico--player-${pl.id}`} />
						{pl.name} character
					</div>
				))}

				{types.map(type => (
					<div className="GridLegend-list-item" key={type}>
						<span className={`GridLegend-ico GridLegend-ico--tile-${type}`} />
						{tileTypeData[type]}
					</div>
				))}
			</ul>
		</div>
	);
};

export default GridLegend;
