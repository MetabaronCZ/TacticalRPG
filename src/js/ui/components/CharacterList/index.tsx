import React from 'react';
import getColumns from 'ui/components/CharacterList/columns';
import { ICharacter } from 'models/character';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'ui/views/ViewCharacterList';

interface ICharacterListProps {
	editable?: boolean;
	characters: ICharacter[];
	onMoveDown?: IOnMoveDown;
	onMoveUp?: IOnMoveUp;
	onDelete?: IOnDelete;
}

const CharacterList = ({ editable = false, characters, onMoveDown, onMoveUp, onDelete }: ICharacterListProps): JSX.Element => {
	const columns = getColumns(editable, onMoveDown, onMoveUp, onDelete);

	// ignore empty character slots
	characters = characters.filter((char) => !!char);

	return (
		<ul className="List">
			<li className="List-row List-row--header">
				{columns.map((col, i) => (
					<span className="List-row-column" key={i}>
						{col.title}
					</span>
				))}
			</li>

			{characters.map((char, i) => {
				return (
					<li className="List-row" key={i}>
						{columns.map((col, j) => (
							<span className={`List-row-column List-row-column--${col.name}`} key={j}>
								{col.value(char, i)}
							</span>
						))}
					</li>
				);
			})}
		</ul>
	);
};

export default CharacterList;
