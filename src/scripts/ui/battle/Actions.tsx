import React, { SyntheticEvent } from 'react';
import CharacterAction from 'modules/battle/character-action';

interface IActionsProps {
	actions: CharacterAction[];
	onSelect: (action: CharacterAction) => void;
}

const Actions: React.SFC<IActionsProps> = ({ actions, onSelect }) => {
	const onClick = (action: CharacterAction) => (e: SyntheticEvent) => {
		e.preventDefault();

		if (action.isActive()) {
			onSelect(action);
		}
	};
	return (
		<ul className="Actions">
			{actions.map((action, i) => (
				<li className={`Actions-item ${!action.isActive() ? 'is-disabled' : ''}`} key={i}>
					<div>
						&rsaquo; <a className="Link" href="#" onClick={onClick(action)}>
							<span className="u-weight-bold">{action.title}</span>
						</a>
					</div>

					<div className="u-text-small">
						{action.id} ({action.cost}AP)
						<br/>
						[ {action.skills.map(skill => skill.id).join(', ')} ]
					</div>
				</li>
			))}
		</ul>
	);
};

export default Actions;
