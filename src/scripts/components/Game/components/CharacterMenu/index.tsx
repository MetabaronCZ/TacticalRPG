import React from 'react';
import { IOnActionSelect } from 'components/Game';
import { ICharacterActions, ICharacterActionItem } from 'models/character';

interface ICharacterMenuProps {
	actions: ICharacterActions;
	onSelect: IOnActionSelect;
}

const selectMenu = (action: ICharacterActionItem, onSelect: IOnActionSelect ) => () => onSelect(action);

const CharacterMenu: React.SFC<ICharacterMenuProps> = ({ actions, onSelect }) => {
	return (
		<ul className="CharacterMenu">
			{actions.map((act, i) => (
				<li className="CharacterMenu-item" key={i}>
					<button className="Button" onClick={selectMenu(act, onSelect)}>
						{act.title}
					</button>
				</li>
			))}
		</ul>
	);
};

export default CharacterMenu;
