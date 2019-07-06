import React from 'react';

import Act from 'modules/battle/act';
import CharacterAction from 'modules/battle/character-action';

import Actions from 'ui/battle/Actions';
import ActionInfo from 'ui/battle/ActionInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';
import { affinityData } from 'data/damage';

interface IProps {
	act: Act | null;
	onActionSelect: (action: CharacterAction) => void;
}

const ReactorUI: React.SFC<IProps> = ({ act, onActionSelect }) => {
	if (!act) {
		return <React.Fragment />;
	}
	const reaction = act.phases.REACTION.getReaction();

	if (!reaction) {
		return <React.Fragment />;
	}
	const { reactor, action, combat } = reaction;
	let actions = act.getActions();
	let info = act.getInfo();

	if ('REACTION' !== act.getPhase()) {
		info = '';
		actions = [];
	}
	return (
		<div className="CharacterBox">
			<CharacterInfo character={reactor} />
			<hr className="Separator" />

			{combat[0].backAttack && (
				<p className="Paragraph">Back attacked!</p>
			)}

			{combat.map((skill, s) => {
				const elm = skill.skill.element;
				return (
					<p className="Paragraph" key={s}>
						<strong>Skill:</strong> {skill.skill.title}
						<br />
						<strong>Affinity:</strong> {affinityData[skill.affinity].title}
						<br />
						<strong>Physical:</strong> {skill.physical}
						<br />
						<strong>Magical:</strong> {skill.magical} {'NONE' !== elm ? `(${elm})` : ''}
						<br />
						<strong>Status:</strong> {skill.status.map(st => st.title).join(', ')}
					</p>
				);
			})}
			<hr className="Separator" />

			{!!action && (
				<React.Fragment>
					<ActionInfo action={action} />
					<hr className="Separator" />
				</React.Fragment>
			)}

			{!!info && (
				<p className="Paragraph">{info}</p>
			)}

			{!reactor.isAI() && (
				<Actions actions={actions} onSelect={onActionSelect} />
			)}
		</div>
	);
};

export default ReactorUI;
