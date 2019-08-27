import React from 'react';

import Command from 'modules/battle/command';

import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';

interface IProps {
	command: Command;
}

const CommandTitle: React.SFC<IProps> = ({ command }) => {
	const elements = command.skills
		.map(skill => skill.element)
		.filter(elm => 'NONE' !== elm);

	const weapons = command.skills
		.map(skill => skill.weapon)
		.filter(wpn => 'NONE' !== wpn);

	return (
		<React.Fragment>
			{weapons.map((wpn, i) => (
				<WeaponIco weapon={wpn} key={i} />
			))}
			{elements.map((elm, i) => (
				<ElementIco element={elm} key={i} />
			))}
			{command.title}
		</React.Fragment>
	);
};

export default CommandTitle;
