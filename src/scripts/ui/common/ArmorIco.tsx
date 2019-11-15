import React from 'react';

import Armors from 'data/armors';
import { ArmorID } from 'modules/equipment/armor-data';

interface IProps {
	readonly armor: ArmorID;
	readonly minimal?: boolean;
}

const ArmorIco: React.SFC<IProps> = ({ armor, minimal }) => {
	if (minimal && 'NONE' === armor) {
		return <React.Fragment />;
	}
	return (
		<span
			className={`Ico Ico--${armor} Ico--${minimal ? 'minimal' : 'default'}`}
			title={Armors.get(armor).title}
		/>
	);
};

export default ArmorIco;
