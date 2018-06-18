import React from 'react';

import Icos from 'data/icos';
import { IOnTileSelect, IGameState, IOnActionSelect } from 'modules/game';

import Bar from 'components/Game/components/Bar';
import ArchetypeIco from 'components/ArchetypeIco';
import Grid from 'components/Game/components/Grid';
import Order from 'components/Game/components/Order';
import Party from 'components/Game/components/Party';
import Layers from 'components/Game/components/Layers';
import Characters from 'components/Game/components/Characters';
import ActionrMenu from 'components/Game/components/ActionMenu';

interface IGameUIProps {
	game: IGameState;
	onTileSelect: IOnTileSelect;
	onActionSelect: IOnActionSelect;
}

const GameUI: React.SFC<IGameUIProps> = props => {
	const { order, characters, actors, act, move, skill, direct, tick } = props.game;
	const acts = actors.map(id => characters.find(char => char.data.id === id));
	const actor = acts[0];

	return (
		<div className="GameUI">
			<div className="GameUI-column  GameUI-column--order">
				<Order order={order} characters={characters} />
			</div>

			<div className="GameUI-column GameUI-column--main">
				<Layers>
					<Characters actor={actor} characters={characters} />
					<Grid
						phase={act.phase}
						moveArea={move.area}
						movePath={move.path}
						moveTarget={move.target}
						skillTargetArea={skill.targetArea}
						skillTargets={skill.targets}
						skillEffectArea={skill.effectArea}
						skillEffectTargets={skill.effectTargets}
						directArea={direct.area}
						directTarget={direct.target}
						onSelect={props.onTileSelect}
					/>
				</Layers>
			</div>

			<div className="GameUI-column GameUI-column--info">
				{actor && (
					<div className="u-mb-2">
						<div className="Paragraph">
							{actor.data.name}
							{' '}
							<ArchetypeIco archetype={actor.data.archetype} />
							{' '}
							{Icos[actor.data.sex.toLowerCase()]}
						</div>

						<Bar
							hp={actor.currAttributes.HP}
							hpMax={actor.baseAttributes.HP}
							ap={actor.currAttributes.AP}
							apMax={actor.baseAttributes.AP}
						/>
					</div>
				)}

				{act.actionMenu && act.actionMenu.length && (
					<ActionrMenu
						actions={act.actionMenu}
						onSelect={props.onActionSelect}
					/>
				)}
			</div>

			<div className="GameUI-column GameUI-column--party">
				<Party characters={characters} />
			</div>
		</div>
	);
};

export default GameUI;
