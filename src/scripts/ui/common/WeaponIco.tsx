import React from 'react';

import Weapons from 'data/weapons';
import { WeaponID } from 'modules/equipment/weapon-data';

interface IProps {
	readonly weapon: WeaponID;
	readonly minimal?: boolean;
}

const WeaponIco: React.SFC<IProps> = ({ weapon, minimal }) => {
	if (minimal && 'NONE' === weapon) {
		return <React.Fragment />;
	}
	return (
		<span
			className={`Ico Ico--${weapon} Ico--${minimal ? 'minimal' : 'default'}`}
			title={Weapons.get(weapon).title}
		/>
	);
};

export default WeaponIco;
