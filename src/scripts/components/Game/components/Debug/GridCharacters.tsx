import React from 'react';

import { gridSize } from 'data/game-config';

import Character from 'engine/character';
import { IPlayerColors } from 'components/Game/components/Debug/Grid';

const itemSize = 100 / gridSize;

interface IGridChactersProps {
	actor: Character|null;
	characters: Character[];
	colors: IPlayerColors[];
}

const GridCharacters: React.SFC<IGridChactersProps> = ({ actor, characters, colors }) => (
	<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', }}>
		{characters.map((char, i) => {
			const x = char.getPosition().getX();
			const y = char.getPosition().getY();
			let color = colors.find(c => c.player === char.getPlayer());

			if (color && actor === char) {
				color = {
					player: color.player,
					colorA: 'yellow',
					colorB: color.colorB
				};
			}
			return (
				<div
					style={{
						position: 'absolute',
						top: y * itemSize + '%',
						left: x * itemSize + '%',
						width: itemSize + '%',
						height: itemSize + '%',
					}}
					title={char.getData().name}
					key={i}
				>
					<div
						style={{
							width: '100%',
							height: '100%',
							border: '4px solid ' + (color ? color.colorA : 'grey'),
							background: (color ? color.colorB : 'black'),
							borderRadius: '100%',
							fontSize: '9px',
							color: 'black',
							textAlign: 'center',
						}}
					>
						{char.getData().name.substring(0, 4).toUpperCase()}
					</div>
				</div>
			);
		})}
	</div>
);

export default GridCharacters;
