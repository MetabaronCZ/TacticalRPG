import React from 'react';

import Skills from 'data/skills';
import { SkillID } from 'modules/skill/skill-data';

interface IProps {
	readonly skill: SkillID;
	readonly minimal?: boolean;
}

export const availableSkillIcos: SkillID[] = ['AETHERSHIELD', 'EVADE'];

const SkillIco: React.SFC<IProps> = ({ skill, minimal }) => {
	if (minimal && !availableSkillIcos.includes(skill)) {
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
