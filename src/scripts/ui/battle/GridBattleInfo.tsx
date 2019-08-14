import React from 'react';

import { firstLetterToUpper } from 'core/string';
import { IBattleInfo, BattleInfoType } from 'modules/battle/battle-info';

export interface IBattleInfoCoords {
	info: IBattleInfo;
	x: number;
	y: number;
}

interface IProps {
	readonly info: IBattleInfoCoords[];
}

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

const GridBattleInfo: React.SFC<IProps> = ({ info }) => (
	<ul className="GridBattleInfo">
		{info.map((item, i) => {
			const { text, type, element } = item.info;

			const variant = getVariant(type);
			const elmText = element || 'PHYSICAL';
			let message = text;

			if ('DAMAGE' === type) {
				message = `${message} (${firstLetterToUpper(elmText.toLowerCase())})`;
			}
			return (
				<li
					className={`GridBattleInfo-item GridBattleInfo-item--${variant}`}
					key={i}
					style={{
						top: item.y + '%',
						left: item.x + '%'
					}}
				>
					{message}
				</li>
			);
		})}
	</ul>
);

export default GridBattleInfo;
