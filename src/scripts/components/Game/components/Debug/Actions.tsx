import React, { SyntheticEvent } from 'react';
import CharacterAction from 'engine/character-action';

interface IActionsProps {
	actions: CharacterAction[];
	onSelect: (action: CharacterAction) => void;
}

const Actions: React.SFC<IActionsProps> = ({ actions, onSelect }) => {
	return (
		<React.Fragment>
			{actions.map((action, i) => {
				const color = action.isActive() ? '' : 'grey';
				const onClick = (e: SyntheticEvent) => {
					e.preventDefault();

					if (action.isActive()) {
						onSelect(action);
					}
				};

				return (
					<div style={{ color, marginBottom: '10px', }} key={i}>
						<div>&rsaquo; <a className="Link" href="#" onClick={onClick}><strong>{action.getTitle()}</strong></a></div>
						<div className="u-text-small">{action.getId()} ({action.getCost()}AP)</div>
						<div className="u-text-small">[ {action.getSkills().join(', ')} ]</div>
					</div>
				);
			})}
		</React.Fragment>
	);
};

export default Actions;
