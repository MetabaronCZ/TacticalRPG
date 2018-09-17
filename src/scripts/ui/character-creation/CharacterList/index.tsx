import React from 'react';

import { CharacterData } from 'engine/character-data';
import getColumns from 'ui/character-creation/CharacterList/columns';

export type IOnMoveDown = (char: CharacterData) => () => void;
export type IOnMoveUp = (char: CharacterData) => () => void;
export type IOnDelete = (char: CharacterData, name: string) => () => void;

interface ICharacterListProps {
	readonly editable?: boolean;
	readonly characters: CharacterData[];
	readonly onMoveDown?: IOnMoveDown;
	readonly onMoveUp?: IOnMoveUp;
	readonly onDelete?: IOnDelete;
}

const CharacterList: React.SFC<ICharacterListProps> = props => {
	const { editable = false, characters, onMoveDown, onMoveUp, onDelete } = props;
	const columns = getColumns(editable, onMoveDown, onMoveUp, onDelete);

	// ignore empty character slots
	const chars = characters.filter(char => !!char);

	return (
		<ul className="List">
			<li className="List-row List-row--header">
				{columns.map((col, i) => (
					<span className="List-row-column" key={i}>
						{col.title}
					</span>
				))}
			</li>

			{chars.map((char, i) => (
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

export default CharacterList;
