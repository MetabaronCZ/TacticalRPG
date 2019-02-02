import React from 'react';

import { firstLetterToUpper } from 'core/string';
import { gridSize } from 'data/game-config';
import { IBattleInfo, BattleInfoType } from 'modules/battle/battle-info';

interface IGridBattleInfo {
	info: IBattleInfo[];
}

const itemSize = 100 / gridSize;

const getVariant = (type: BattleInfoType): string => {
	switch (type) {
		case 'DAMAGE':
		case 'DEBUFF':
			return 'damage';

		case 'HEALING':
		case 'BUFF':
			return 'healing';

		default:
			return 'default';
	}
};

const GridBattleInfo: React.SFC<IGridBattleInfo> = ({ info }) => {
	return (
		<ul className="GridBattleInfo">
			{info.map(({ text, type, element, position }, i) => {
				const variant = getVariant(type);
				const elmText = element || 'PHYSICAL';

				if ('DAMAGE' === type) {
					text = `${text} (${firstLetterToUpper(elmText.toLowerCase())})`;
				}
				return (
					<li
						className={`GridBattleInfo-item GridBattleInfo-item--${variant}`}
						key={i}
						style={
							{
								top: `${position.y * itemSize}%`,
								left: `${position.x * itemSize}%`,
							}
						}
					>
						{text}
					</li>
				);
			})}
		</ul>
	);
};

export default GridBattleInfo;
