import React from 'react';

import { IActState } from 'modules/battle/act';

import EmptyUI from 'ui/battle/EmptyUI';
import CombatInfo from 'ui/battle/CombatInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	readonly act: IActState;
}

const ReactorUI: React.SFC<IProps> = ({ act }) => {
	const { effectTarget, combatInfo } = act.phases.COMMAND;
	const combat = combatInfo.find(item => effectTarget === item.character);

	if (!combat || !effectTarget) {
		return <EmptyUI />;
	}
	return (
		<div className="CharacterBox">
			<div className={`CharacterBox-player CharacterBox-player--player${effectTarget.player.id}`} />

			<CharacterInfo character={effectTarget} />
			<hr className="Separator" />

			<CombatInfo combat={combat.combat} />
		</div>
	);
};

export default ReactorUI;
