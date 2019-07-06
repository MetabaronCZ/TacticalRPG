import React from 'react';

import Act from 'modules/battle/act';
import CharacterAction from 'modules/battle/character-action';

import Actions from 'ui/battle/Actions';
import ActionInfo from 'ui/battle/ActionInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	act: Act | null;
	onActionSelect: (action: CharacterAction) => void;
}

const ActorUI: React.SFC<IProps> = ({ act, onActionSelect }) => {
	if (!act) {
		return <React.Fragment />;
	}
	const { actor } = act;
	const action = act.phases.ACTION.getAction();
	const reactions = act.phases.REACTION.getReactions();

	let actions = act.getActions();
	let info = act.getInfo();

	if ('REACTION' === act.getPhase()) {
		info = '';
		actions = [];
	}
	return (
		<div className="CharacterBox">
			<CharacterInfo character={actor} />

			<hr className="Separator" />

			{!!action && (
				<React.Fragment>
					<ActionInfo action={action} />
					<hr className="Separator" />
				</React.Fragment>
			)}

			{reactions.length > 0 && (
				<React.Fragment>
					<div>
						<strong>Targets:</strong>
						<br/>
						{reactions.map((tgt, t) => {
							const { reactor, action: reactionAction } = tgt;
							let txt = '...';

							if (reactionAction) {
								txt = reactionAction.title;
							}
							return (
								<div key={t}>
									{reactor.name} ({txt})
								</div>
							);
						})}
					</div>
					<hr className="Separator" />
				</React.Fragment>
			)}

			{!!info && (
				<p className="Paragraph">{info}</p>
			)}

			{!actor.isAI() && (
				<Actions actions={actions} onSelect={onActionSelect} />
			)}
		</div>
	);
};

export default ActorUI;
