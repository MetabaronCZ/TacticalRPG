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
					{action.isActive
						? (
							<div>
								<a className="Link" href="#" onClick={onClick(action)}>
									<strong>{action.title}</strong>
								</a>
								<div className="u-text-small">
									{action.id} ({action.cost}AP)
								</div>
							</div>
						)
						: (
							<div>
								<strong>{action.title}</strong>

								{action.cooldown > 0 && (
									<div className="u-text-small">{action.cooldown} turn/s</div>
								)}
							</div>
						)
					}
				</li>
			))}
		</ul>
	);
};

export default Actions;
