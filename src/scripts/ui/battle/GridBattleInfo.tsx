import React from 'react';

import { gridSize } from 'data/game-config';
import { IBattleInfo } from 'modules/battle/battle-info';

interface IGridBattleInfo {
	info: IBattleInfo[];
}

const itemSize = 100 / gridSize;

const GridBattleInfo: React.SFC<IGridBattleInfo> = ({ info }) => {
	return (
		<ul className="GridBattleInfo">
			{info.map(({ text, position }, i) => (
				<li
					className="GridBattleInfo-item"
					style={
						{
							top: `${position.y * itemSize}%`,
							left: `${position.x * itemSize}%`,
						}
					}
					key={i}
				>
					{text}
				</li>
			))}
		</ul>
	);
};

export default GridBattleInfo;
