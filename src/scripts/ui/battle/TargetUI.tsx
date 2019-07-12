import React from 'react';

import Act from 'modules/battle/act';

import EmptyUI from 'ui/battle/EmptyUI';
import CombatInfo from 'ui/battle/CombatInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	act: Act;
}

const ReactorUI: React.SFC<IProps> = ({ act }) => {
	const target = act.phases.COMMAND.getEffectTarget();
	const combatInfo = act.phases.COMMAND.getCombatInfo();
	const combat = combatInfo.find(item => target === item.character);

	if (!combat || !target) {
		return <EmptyUI />;
	}
	return (
		<div className="CharacterBox">
			<div className={`CharacterBox-player CharacterBox-player--player${target.player.id}`} />

			<CharacterInfo character={target} />
			<hr className="Separator" />

			<CombatInfo combat={combat.combat} />
		</div>
	);
};

export default ReactorUI;
