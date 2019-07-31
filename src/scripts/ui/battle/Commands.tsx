import React, { SyntheticEvent } from 'react';
import Command, { formatCost } from 'modules/battle/command';

type IOnSelect = (command: Command) => void;

interface IProps {
	readonly commands: Command[];
	readonly onSelect: IOnSelect;
}

interface IButtons {
	[id: number]: HTMLElement | null;
}

const Commands: React.SFC<IProps> = ({ commands, onSelect }) => {
	const buttons: IButtons = {};

	const onClick = (command: Command, id: number) => (e: SyntheticEvent) => {
		e.preventDefault();

		if (command.isActive()) {
			onSelect(command);
		}
		const button = buttons[id];

		if (button) {
			button.blur();
		}
	};
	return (
		<ul className="Commands">
			{commands.map((command, i) => {
				const usable = command.isUsable();
				const cd = command.cooldown;
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

				return (
					<li className="Commands-item" key={command.title}>
						<button
							className={`Command ${true !== usable ? 'is-disabled' : ''}`}
							type="button"
							ref={elm => buttons[i] = elm}
							onClick={onClick(command, i)}
						>
							<span className="Command-title">
								{command.title}
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
