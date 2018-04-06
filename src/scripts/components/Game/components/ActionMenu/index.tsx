import React from 'react';
import { IOnActionSelect } from 'components/Game';
import Button, { ButtonColor } from 'components/Button';
import { IActions, IActionItem, ActionID } from 'models/character';

interface ICharacterMenuProps {
	actions: IActions;
	onSelect: IOnActionSelect;
}

const selectMenu = (action: IActionItem, onSelect: IOnActionSelect ) => () => action.active && onSelect(action);

const ActionrMenu: React.SFC<ICharacterMenuProps> = ({ actions, onSelect }) => {
	return (
		<ul className="ActionMenu">
			{actions.map((act, i) => {
				const actionType = act.id;
				let color = ButtonColor.YELLOW;

				if (!act.active) {
					// disabled button
					color = ButtonColor.GREY;

				} else {
					// colored buttons
					switch (actionType) {
						case ActionID.MOVE:
							color = ButtonColor.BLUE;
							break;

						case ActionID.PASS:
						case ActionID.CONFIRM:
							color = ButtonColor.GREEN;
							break;

						case ActionID.ATTACK:
						case ActionID.DOUBLE_ATTACK:
							color = ButtonColor.RED;
							break;
					}
				}
				return (
					<li className="ActionMenu-item" key={i}>
						<Button text={act.title} color={color} onClick={selectMenu(act, onSelect)} />
					</li>
				);
			})}
		</ul>
	);
};

export default ActionrMenu;
