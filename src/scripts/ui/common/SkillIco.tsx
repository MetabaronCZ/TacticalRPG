import React from 'react';

import Skills from 'data/skills';
import { SkillID } from 'modules/skill/skill-data';

interface IProps {
	skill: SkillID;
	minimal?: boolean;
}

export const availableSkillIcos: SkillID[] = ['ENERGY_SHIELD', 'EVADE'];

const SkillIco: React.SFC<IProps> = ({ skill, minimal }) => {
	if (minimal && -1 !== availableSkillIcos.indexOf(skill)) {
		return <React.Fragment />;
	}
	return (
		<span
			className={`Ico Ico--${skill} Ico--${minimal ? 'minimal' : 'default'}`}
			title={Skills.get(skill).title}
		/>
	);
};

export default SkillIco;
