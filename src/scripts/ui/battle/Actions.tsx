import React, { SyntheticEvent } from 'react';
import CharacterAction, { formatCost } from 'modules/battle/character-action';

type IOnSelect = (action: CharacterAction) => void;

interface IActionsProps {
	actions: CharacterAction[];
	onSelect: IOnSelect;
}

interface IButtons {
	[id: number]: HTMLElement | null;
}

const Actions: React.SFC<IActionsProps> = ({ actions, onSelect }) => {
	const buttons: IButtons = {};

	const onClick = (action: CharacterAction, id: number) => (e: SyntheticEvent) => {
		e.preventDefault();

		if (action.isActive()) {
			onSelect(action);
		}
		const button = buttons[id];

		if (button) {
			button.blur();
		}
	};
	return (
		<ul className="Actions">
			{actions.map((action, i) => {
				const usable = action.isUsable();
				const cd = action.cooldown;
				let info = formatCost(action.cost);

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
					<li className="Actions-item" key={i}>
						<button
							className={`ActionButton ${true !== usable ? 'is-disabled' : ''}`}
							type="button"
							ref={elm => buttons[i] = elm}
							onClick={onClick(action, i)}
						>
							<span className="ActionButton-title">
								{action.title}
							</span>

							<span className="ActionButton-cost">
								{info}
							</span>
						</button>
					</li>
				);
			})}
		</ul>
	);
};

export default Actions;
