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
					{0 === action.cooldown
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

								<div className="u-text-small">
									{'ULTIMATE' === action.cooldown ? 'Ultimate skill used' : action.cooldown + ' turn/s'}
								</div>
							</div>
						)
					}
				</li>
			))}
		</ul>
	);
};

export default Actions;
