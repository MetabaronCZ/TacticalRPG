import React from 'react';

import { IBattleInfo, BattleInfoType } from 'modules/battle/battle-info';

import Ico from 'ui/common/Ico';
import WeaponIco from 'ui/common/WeaponIco';
import StatusIco from 'ui/common/StatusIco';
import ElementIco from 'ui/common/ElementIco';

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
			const { text, type, weapon, element, status } = item.info;

			const variant = getVariant(type);
			let message: React.ReactNode = text;

			switch (type) {
				case 'DAMAGE':
				case 'DEBUFF':
					message = (
						<React.Fragment>
							{weapon && (
								<WeaponIco weapon={weapon} minimal />
							)}
							{element && (
								<ElementIco element={element} minimal />
							)}
							{status && (
								<StatusIco status={status} minimal />
							)}
							{' '}
							{message}
						</React.Fragment>
					);
					break;

				case 'HEALING':
				case 'BUFF':
					message = (
						<React.Fragment>
							<Ico name="healing" />
							{message}
						</React.Fragment>
					);
					break;

				default:
					// pass
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
