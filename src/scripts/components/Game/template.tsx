import React from 'react';

import Icos from 'data/icos';
import { Jobs } from 'models/job';

import Bar from 'components/Game/components/Bar';
import ArchetypeIco from 'components/ArchetypeIco';
import Grid from 'components/Game/components/Grid';
import Info from 'components/Game/components/Info';
import Order from 'components/Game/components/Order';
import Party from 'components/Game/components/Party';
import Layers from 'components/Game/components/Layers';
import Characters from 'components/Game/components/Characters';
import CharacterMenu from 'components/Game/components/CharacterMenu';
import { IOnCharacterSelect, IOnGridSelect, IGameState, IOnActionSelect } from 'components/Game';

export interface IGameUIProps {
	game: IGameState;
	onCharacterSelect: IOnCharacterSelect;
	onGridSelect: IOnGridSelect;
	onActionSelect: IOnActionSelect;
}

const GameUI: React.SFC<IGameUIProps> = props => {
	const { order, characters, actors, selected, characterActions, tick } = props.game;
	const acts = actors.map(id => characters.find(char => char.data.id === id));
	const actor = acts[0];

	return (
		<div className="GameUI">
			<div className="GameUI-column  GameUI-column--order">
				<Order order={order} characters={characters} />
			</div>

			<div className="GameUI-column GameUI-column--main">
				<Layers>
					<Characters characters={characters} onSelect={props.onCharacterSelect} />
					<Grid onSelect={props.onGridSelect} />
				</Layers>
			</div>

			<div className="GameUI-column GameUI-column--info">
				<Info tick={tick} selected={selected} />

				{actor && (
					<div className="u-mb-2">
						<div className="Paragraph">
							{actor.data.name}
							{' '}
							<ArchetypeIco primary={actor.data.primary} secondary={actor.data.secondary} />
							{' '}
							{Icos[actor.data.sex.toLowerCase()]}
							{' '}
							{Jobs.get(actor.data.job).title}
						</div>

						<Bar
							hp={actor.currAttributes.HP}
							hpMax={actor.baseAttributes.HP}
							ap={actor.currAttributes.AP}
							apMax={actor.baseAttributes.AP}
						/>

						<br/>

						<p className="Paragraph">
							ACTORS: {acts.map(char => char && char.data.name).join(', ')}
						</p>
					</div>
				)}

				{characterActions && characterActions.length && (
					<CharacterMenu
						actions={characterActions}
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
