import React from 'react';
import { IOnActionSelect } from 'components/Game';
import { ICharacterActions, ICharacterActionItem, CharacterActionID } from 'models/character';

interface ICharacterMenuProps {
	actions: ICharacterActions;
	onSelect: IOnActionSelect;
}

const selectMenu = (action: ICharacterActionItem, onSelect: IOnActionSelect ) => () => onSelect(action);

const CharacterMenu: React.SFC<ICharacterMenuProps> = ({ actions, onSelect }) => {
	return (
		<ul className="CharacterMenu">
			{actions.map((act, i) => {
				const actionType = act.id;
				let color = 'Yellow';

				switch (actionType) {
					case CharacterActionID.MOVE: color = 'Blue'; break;
					case CharacterActionID.PASS: color = 'Green'; break;
					case CharacterActionID.ATTACK: color = 'Red'; break;
				}
				return (
					<li className="CharacterMenu-item" key={i}>
						<button className={`Button Button--color${color}`} onClick={selectMenu(act, onSelect)}>
							{act.title}
						</button>
					</li>
				);
			})}
		</ul>
	);
};

export default CharacterMenu;
