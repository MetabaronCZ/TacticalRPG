import React, { SyntheticEvent } from 'react';

import CommandTitle from 'ui/battle/CommandTitle';
import { formatCost, ICommandSnapshot } from 'modules/battle/command';

type OnSelect = (commandID: string) => void;

interface IProps {
	readonly commands: ICommandSnapshot[];
	readonly onSelect: OnSelect;
}

interface IButtons {
	[id: number]: HTMLElement | null;
}

const Commands: React.SFC<IProps> = ({ commands, onSelect }) => {
	const buttons: IButtons = {};

	const onClick = (command: ICommandSnapshot, buttonID: number) => (e: SyntheticEvent) => {
		e.preventDefault();

		if (command.isActive) {
			onSelect(command.id);
		}
		const button = buttons[buttonID];

		if (button) {
			button.blur();
		}
	};
	return (
		<ul className="Commands">
			{commands.map((command, i) => {
				const cd = command.cooldown;
				const usable = command.isUsable;
				let info = formatCost(command.cost);

				switch (usable) {
					case 'CANT_ACT':
					case 'DISARMED':
					case 'SILENCED':
						info = 'N/A';
						break;

					case 'COOLDOWN':
						if ('ULTIMATE' === cd) {
							info = 'Used';
						} else {
							info = `${cd} ${1 === cd ? 'turn' : 'turns'}`;
						}
						break;

					default:
						// do nothing
				}
				const key = `${command.title}-${command.skills.map(skill => skill.id).join('-')}`;

				return (
					<li className="Commands-item" key={key}>
						<button
							className={`Command ${true !== usable ? 'is-disabled' : ''}`}
							type="button"
							ref={elm => buttons[i] = elm}
							onClick={onClick(command, i)}
						>
							<span className="Command-title">
								<CommandTitle command={command} />
							</span>

							<span className="Command-cost">
								{info}
							</span>
						</button>
					</li>
				);
			})}
		</ul>
	);
};

export default Commands;
