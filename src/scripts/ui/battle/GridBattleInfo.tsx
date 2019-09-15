import React from 'react';

import { IBattleInfo, BattleInfoType } from 'modules/battle/battle-info';

import ElementIco from 'ui/common/ElementIco';
import WeaponIco from 'ui/common/WeaponIco';

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
			const { text, type, skill } = item.info;

			const variant = getVariant(type);
			let message: React.ReactNode = text;

			if ('ACTION' !== type && 'REACTION' !== type) {
				message = (
					<React.Fragment>
						{'NONE' !== skill.weapon && (
							<WeaponIco weapon={skill.weapon} />
						)}
						{'NONE' !== skill.element && (
							<ElementIco element={skill.element} />
						)}
						{message}
					</React.Fragment>
				);
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
