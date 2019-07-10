import React from 'react';

import Act from 'modules/battle/act';

import CombatInfo from 'ui/battle/CombatInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	act: Act | null;
}

const ReactorUI: React.SFC<IProps> = ({ act }) => {
	if (!act) {
		return <React.Fragment />;
	}
	const target = act.phases.COMMAND.getEffectTarget();
	const combatInfo = act.phases.COMMAND.getCombatInfo();
	const combat = combatInfo.find(item => target === item.character);

	if (!combat || !target) {
		return <React.Fragment />;
	}
	return (
		<div className="CharacterBox">
			<CharacterInfo character={target} />
			<hr className="Separator" />

			<CombatInfo combat={combat.combat} />
		</div>
	);
};

export default ReactorUI;