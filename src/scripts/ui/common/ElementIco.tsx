import React from 'react';

import elements from 'data/elements';
import { SkillElement } from 'modules/skill/skill-data';

interface IProps {
	element: SkillElement;
	minimal?: boolean;
}

const ElementIco: React.SFC<IProps> = ({ element, minimal }) => {
	if (minimal && 'NONE' === element) {
		return <React.Fragment />;
	}
	return (
		<span
			className={`Ico Ico--${element} Ico--${minimal ? 'minimal' : 'default'}`}
			title={elements[element].title}
		/>
	);
};

export default ElementIco;
