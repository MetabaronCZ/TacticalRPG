import React, { SyntheticEvent } from 'react';
import CharacterAction, { ICharacterActionCost } from 'modules/battle/character-action';

interface IActionsProps {
	actions: CharacterAction[];
	onSelect: (action: CharacterAction) => void;
}

const formatCost = (cost: ICharacterActionCost | null): string => {
	if (null === cost) {
		return '';
	}
	const costArray = [cost.AP ? `${cost.AP} AP` : '', cost.MP ? `${cost.MP} MP` : ''];
	const result = costArray.filter(c => '' !== c).join(', ');
	return result ? `(${result})` : '';
};

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
									{action.type} {formatCost(action.cost)}
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
