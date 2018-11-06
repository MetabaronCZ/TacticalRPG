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
							<strong>{action.title}</strong>
						</a>
					</div>

					<div className="u-text-small">
						<div>{action.id} ({action.cost}AP)</div>

						{action.cooldown > 0 && (
							<div>{action.cooldown} turn/s</div>
						)}

						<div>[ {action.skills.map(skill => skill.id).join(', ')} ]</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default Actions;
