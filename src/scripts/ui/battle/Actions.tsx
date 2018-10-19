import React, { SyntheticEvent } from 'react';
import CharacterAction from 'modules/battle/character-action';

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
						<div>&rsaquo; <a className="Link" href="#" onClick={onClick}><strong>{action.title}</strong></a></div>
						<div className="u-text-small">{action.id} ({action.cost}AP)</div>
						<div className="u-text-small">[ {action.skills.map(skill => skill.id).join(', ')} ]</div>
					</div>
				);
			})}
		</React.Fragment>
	);
};

export default Actions;
