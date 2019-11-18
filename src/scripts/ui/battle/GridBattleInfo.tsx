import React from 'react';

import { IBattleInfo } from 'modules/battle/battle-info';

import Ico from 'ui/common/Ico';
import WeaponIco from 'ui/common/WeaponIco';
import StatusIco from 'ui/common/StatusIco';
import ElementIco from 'ui/common/ElementIco';

export interface IBattleInfoCoords {
	readonly info: IBattleInfo;
	readonly x: number;
	readonly y: number;
}

interface IProps {
	readonly info: IBattleInfoCoords[];
}

const GridBattleInfo: React.SFC<IProps> = ({ info }) => (
	<ul className="GridBattleInfo">
		{info.map((item, i) => {
			const { text, type, weapon, element, status } = item.info;
			let message: React.ReactNode = text;

			switch (type) {
				case 'DAMAGE':
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
					message = (
						<React.Fragment>
							<Ico name="healing" />
							{message}
						</React.Fragment>
					);
					break;

				case 'BUFF':
				case 'DEBUFF':
					message = (
						<React.Fragment>
							{status && (
								<StatusIco status={status} minimal />
							)}
							{' '}
							{message}
						</React.Fragment>
					);
					break;

				default:
					// pass
			}

			return (
				<li
					className="GridBattleInfo-item"
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
