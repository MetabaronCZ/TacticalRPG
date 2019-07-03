import React, { SyntheticEvent } from 'react';
import CharacterAction, { ICharacterActionCost } from 'modules/battle/character-action';

type IOnSelect = (action: CharacterAction) => void;

interface IActionsProps {
	actions: CharacterAction[];
	onSelect: IOnSelect;
}

interface IButtons {
	[id: number]: HTMLElement | null;
}

const isActiveAction = (action: CharacterAction) => action.active && 0 === action.cooldown;

const formatCost = (cost: ICharacterActionCost | null): string => {
	if (!cost) {
		return '';
	}
	const costArray = [cost.AP ? `${cost.AP} AP` : '', cost.MP ? `${cost.MP} MP` : ''];
	return costArray.filter(c => '' !== c).join(' | ');
};

const Actions: React.SFC<IActionsProps> = ({ actions, onSelect }) => {
	const buttons: IButtons = {};

	const onClick = (action: CharacterAction, id: number) => (e: SyntheticEvent) => {
		e.preventDefault();

		if (isActiveAction(action)) {
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
				const active = isActiveAction(action);
				const cd = action.cooldown;
				return (
					<li className="Actions-item" key={i}>
						<button
							className={`ActionButton ${!active ? 'is-disabled' : ''}`}
							type="button"
							ref={elm => buttons[i] = elm}
							onClick={onClick(action, i)}
						>
							<span className="ActionButton-title">
								{action.title}
							</span>

							<span className="ActionButton-cost">
								{active
									? formatCost(action.cost)
									: (0 === cd
										? 'N/A'
										: ('ULTIMATE' === cd ? 'Ultimate skill used' : `${cd} ${1 === cd ? 'turn' : 'turns'}`)
									)
								}
							</span>
						</button>
					</li>
				);
			})}
		</ul>
	);
};

export default Actions;
