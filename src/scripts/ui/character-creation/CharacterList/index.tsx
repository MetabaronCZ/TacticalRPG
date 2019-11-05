import React from 'react';
import { observer } from 'mobx-react';

import { ICharacterData } from 'modules/character-creation/character-data';
import getColumns from 'ui/character-creation/CharacterList/columns';

export type OnMoveDown = (id: string) => () => void;
export type OnMoveUp = (id: string) => () => void;
export type OnDelete = (id: string) => () => void;

interface ICharacterListProps {
	readonly editable?: boolean;
	readonly characters: ICharacterData[];
	readonly onMoveDown?: OnMoveDown;
	readonly onMoveUp?: OnMoveUp;
	readonly onDelete?: OnDelete;
}

const CharacterList: React.SFC<ICharacterListProps> = props => {
	const { editable = false, characters, onMoveDown, onMoveUp, onDelete } = props;

	if (!characters.length) {
		return null;
	}
	const columns = getColumns(editable, onMoveDown, onMoveUp, onDelete);

	return (
		<ul className="List">
			<li className="List-row List-row--header">
				{columns.map(col => (
					<span className="List-row-column" key={col.name}>
						{col.title || ''}
					</span>
				))}
			</li>

			{characters.map((char, i) => (
				<li className="List-row" key={char.id}>
					{columns.map(col => (
						<span className={`List-row-column List-row-column--${col.name}`} key={col.name}>
							{col.value(char, i)}
						</span>
					))}
				</li>
			))}
		</ul>
	);
};

export default observer(CharacterList);
