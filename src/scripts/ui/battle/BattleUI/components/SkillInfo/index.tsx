import React from 'react';

import { blockSize } from 'data/game-config';
import { ISkillInfo } from 'modules/game/types';

interface ISkillInfoLayer {
	items: ISkillInfo[];
}

const SkillInfoLayer: React.SFC<ISkillInfoLayer> = ({ items }) => (
	<div className="SkillInfo">
		{items.map((item, i) => {
			const style: React.CSSProperties = {
				top: (item.position.y * blockSize) + 'px',
				left: (item.position.x * blockSize) + 'px',
			};
			return (
				<div className="SkillInfo-item" key={i} style={style}>
					{item.text}
				</div>
			);
		})}
	</div>
);

export default SkillInfoLayer;
