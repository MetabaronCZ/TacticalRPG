import React from 'react';
import { observer } from 'mobx-react';

import CharacterList from 'engine/character-list';
import { CharacterData } from 'engine/character-data';

import getColumns from 'ui/character-creation/CharacterList/columns';

export type IOnMoveDown = (char: CharacterData) => () => void;
export type IOnMoveUp = (char: CharacterData) => () => void;
export type IOnDelete = (char: CharacterData) => () => void;

interface ICharacterListProps {
	readonly editable?: boolean;
	readonly characters: CharacterList;
	readonly onMoveDown?: IOnMoveDown;
	readonly onMoveUp?: IOnMoveUp;
	readonly onDelete?: IOnDelete;
}

const CharacterListUI: React.SFC<ICharacterListProps> = props => {
	const { editable = false, characters, onMoveDown, onMoveUp, onDelete } = props;

	if (!characters.data.length) {
		return null;
	}
	const columns = getColumns(characters, editable, onMoveDown, onMoveUp, onDelete);

	return (
		<ul className="List">
			<li className="List-row List-row--header">
				{columns.map((col, i) => (
					<span className="List-row-column" key={i}>
						{col.title}
					</span>
				))}
			</li>

			{characters.data.map((char, i) => (
				<li className="List-row" key={i}>
					{columns.map((col, j) => (
						<span className={`List-row-column List-row-column--${col.name}`} key={j}>
							{col.value(char, i)}
						</span>
					))}
				</li>
			))}
		</ul>
	);
};

export default observer(CharacterListUI);
