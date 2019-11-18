import React from 'react';

import { ICommandSnapshot } from 'modules/battle/command';

import Ico from 'ui/common/Ico';
import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import SkillIco, { availableSkillIcos } from 'ui/common/SkillIco';

interface IProps {
	readonly command: ICommandSnapshot;
}

const CommandTitle: React.SFC<IProps> = ({ command }) => {
	if (!command.skills.length) {
		return (
			<span>{command.title}</span>
		);
	}

	if (command.isSupport) {
		return (
			<React.Fragment>
				<Ico name="healing" />
				{command.title}
			</React.Fragment>
		);
	}
	const elements = command.skills
		.map(skill => skill.magical ? skill.magical.element : null)
		.filter((elm): elm is Exclude<typeof elm, null> => null !== elm);

	const weapons = command.skills
		.map(skill => skill.physical ? skill.physical.weapon : null)
		.filter((wpn): wpn is Exclude<typeof wpn, null> => null !== wpn);

	const skills = command.skills
		.map(skill => skill.id)
		.filter(skill => availableSkillIcos.includes(skill));

	return (
		<React.Fragment>
			{weapons.map((wpn, i) => (
				<WeaponIco weapon={wpn} key={i} />
			))}
			{elements.map((elm, i) => (
				<ElementIco element={elm} key={i} />
			))}
			{skills.map((skill, i) => (
				<SkillIco skill={skill} key={i} />
			))}
			{command.title}
		</React.Fragment>
	);
};

export default CommandTitle;
