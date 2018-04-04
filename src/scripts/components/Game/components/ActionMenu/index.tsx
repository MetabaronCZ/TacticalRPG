import React from 'react';
import { IOnActionSelect } from 'components/Game';
import { IActions, IActionItem, ActionID } from 'models/character';

interface ICharacterMenuProps {
	actions: IActions;
	onSelect: IOnActionSelect;
}

const selectMenu = (action: IActionItem, onSelect: IOnActionSelect ) => () => onSelect(action);

const ActionrMenu: React.SFC<ICharacterMenuProps> = ({ actions, onSelect }) => {
	return (
		<ul className="ActionMenu">
			{actions.map((act, i) => {
				const actionType = act.id;
				let color = 'Yellow';

				switch (actionType) {
					case ActionID.MOVE:
						color = 'Blue';
						break;

					case ActionID.PASS:
					case ActionID.CONFIRM:
						color = 'Green';
						break;

					case ActionID.ATTACK:
					case ActionID.DOUBLE_ATTACK:
						color = 'Red';
						break;
				}
				return (
					<li className="ActionMenu-item" key={i}>
						<button className={`Button Button--color${color}`} onClick={selectMenu(act, onSelect)}>
							{act.title}
						</button>
					</li>
				);
			})}
		</ul>
	);
};

export default ActionrMenu;
