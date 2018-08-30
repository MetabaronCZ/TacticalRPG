import React from 'react';

import Icos from 'data/icos';
import { IPosition } from 'modules/position/types';
import { IOnTileSelect, IGameState, IOnActionSelect, ActPhase } from 'modules/game/types';

import Bar from 'components/Game/components/Bar';
import ArchetypeIco from 'components/ArchetypeIco';
import Grid from 'components/Game/components/Grid';
import Order from 'components/Game/components/Order';
import Party from 'components/Game/components/Party';
import Layers from 'components/Game/components/Layers';
import SkillInfo from 'components/Game/components/SkillInfo';
import Characters from 'components/Game/components/Characters';
import ActionrMenu from 'components/Game/components/ActionMenu';

interface IGameUIProps {
	readonly game: IGameState;
	readonly onTileSelect: IOnTileSelect;
	readonly onActionSelect: IOnActionSelect;
}

const GameUI: React.SFC<IGameUIProps> = props => {
	const { order, characters, actors, act, move, skill, react, direct } = props.game;
	const acts = actors.map(id => characters.find(char => char.data.id === id));
	const actor = acts[0];
	let charInfo = actor;

	if (-1 !== [ActPhase.REACTION, ActPhase.EVASION].indexOf(act.phase)) {
		charInfo = characters.find(char => char.data.id === (react.targets && react.targets[0]));
	}
	const skillEffectTargetIds = skill.effectTargets || [];
	const skillEffectTargets: IPosition[] = [];

	for (const id of skillEffectTargetIds) {
		const char = characters.find(ch => ch.data.id === id);

		if (!char) {
			continue;
		}
		skillEffectTargets.push(char.position);
	}

	return (
		<div className="GameUI">
			<div className="GameUI-column  GameUI-column--order">
				<Order order={order} characters={characters} />
			</div>

			<div className="GameUI-column GameUI-column--main">
				<Layers>
					<SkillInfo items={props.game.skillInfo} />
					<Characters actor={actor} characters={characters} />
					<Grid
						phase={act.phase}
						moveArea={move.area}
						movePath={move.path}
						moveTarget={move.target}
						skillTargetArea={skill.targetArea}
						skillTargets={skill.targets}
						skillEffectArea={skill.effectArea}
						skillEffectTargets={skillEffectTargets}
						reactEvasionArea={react.evasionArea}
						reactEvasionTarget={react.evasionTarget}
						directArea={direct.area}
						directTarget={direct.target}
						onSelect={props.onTileSelect}
					/>
				</Layers>
			</div>

			<div className="GameUI-column GameUI-column--info">
				{charInfo && (
					<div className="u-mb-2">
						<div className="Paragraph">
							{charInfo.data.name}
							{' '}
							<ArchetypeIco archetype={charInfo.data.archetype} />
							{' '}
							{Icos[charInfo.data.sex.toLowerCase()]}
						</div>

						<Bar
							hp={charInfo.currAttributes.HP}
							hpMax={charInfo.baseAttributes.HP}
							ap={charInfo.currAttributes.AP}
							apMax={charInfo.baseAttributes.AP}
						/>
					</div>
				)}

				{(act.actionMenu && act.actionMenu.length) && (
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
