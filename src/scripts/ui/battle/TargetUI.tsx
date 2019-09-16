import React from 'react';

import { IActState } from 'modules/battle/act';

import EmptyUI from 'ui/battle/EmptyUI';
import TargetInfo from 'ui/battle/TargetInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	readonly act: IActState;
}

const TargetUI: React.SFC<IProps> = ({ act }) => {
	const { effectTarget: target, combatInfo } = act.phases.COMMAND;
	const combat = combatInfo.find(item => target === item.character);

	if (!combat || !target) {
		return <EmptyUI />;
	}
	return (
		<div className="CharacterBox">
			<div className={`CharacterBox-player CharacterBox-player--player${target.player}`} />

			<CharacterInfo character={target} />
			<hr className="Separator" />

			<TargetInfo character={target} />
		</div>
	);
};

export default TargetUI;
