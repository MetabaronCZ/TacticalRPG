import React from 'react';

import elements from 'data/elements';
import { ElementID } from 'modules/skill/affinity';

interface IProps {
	element: ElementID;
	minimal?: boolean;
}

const ElementIco: React.SFC<IProps> = ({ element, minimal }) => (
	<span
		className={`Ico Ico--${element} Ico--${minimal ? 'minimal' : 'default'}`}
		title={elements[element].title}
	/>
);

export default ElementIco;