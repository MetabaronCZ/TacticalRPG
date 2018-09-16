import React from 'react';

import { gridSize } from 'data/game-config';

import Character from 'engine/character';
import { IPlayerColors } from 'ui/battle/BattleUI/Grid';

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
			const dir: { [pos: string]: string|0 } = { top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' };
			const dirIcoSize = 4;

			switch (char.getDirection()) {
				case 'TOP':		dir.top = 0; dir.left = `calc(50% - ${dirIcoSize}px)`; break;
				case 'BOTTOM':	dir.bottom = 0; dir.left = `calc(50% - ${dirIcoSize}px)`; break;
				case 'LEFT':	dir.top = `calc(50% - ${dirIcoSize}px)`; dir.left = 0; break;
				case 'RIGHT':	dir.top = `calc(50% - ${dirIcoSize}px)`; dir.right = 0; break;
			}

			if (color && actor === char) {
				color = {
					player: color.player,
					colorA: 'yellow',
					colorB: color.colorB
				};
			}
			return (
				<div
					style={
						{
							position: 'absolute',
							top: y * itemSize + '%',
							left: x * itemSize + '%',
							width: itemSize + '%',
							height: itemSize + '%',
						}
					}
					title={char.getData().name}
					key={i}
				>
					<div
						style={
							{
								width: '100%',
								height: '100%',
								border: '4px solid ' + (color ? color.colorA : 'grey'),
								background: (color ? color.colorB : 'black'),
								borderRadius: '100%',
								fontSize: '9px',
								color: 'black',
								textAlign: 'center',
							}
						}
					>
						{char.getData().name.substring(0, 4).toUpperCase()}

						<div
							style={
								{
									position: 'absolute',
									top: dir.top,
									bottom: dir.bottom,
									left: dir.left,
									right: dir.right,
									width: 0,
									height: 0,
									borderRadius: '4px',
									border: dirIcoSize + 'px solid white',
								}
							}
						/>
					</div>
				</div>
			);
		})}
	</div>
);

export default GridCharacters;
