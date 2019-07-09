import React from 'react';

import { affinityData } from 'data/damage';

import Act from 'modules/battle/act';
import StatusEffect from 'modules/battle/status-effect';
import CharacterAction from 'modules/battle/character-action';

import Actions from 'ui/battle/Actions';
import ActionInfo from 'ui/battle/ActionInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	act: Act | null;
	onActionSelect: (action: CharacterAction) => void;
}

const formatStatus = (status: StatusEffect[]) => {
	return status.map(st => st.title).join(', ') || 'none';
};

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

			{combat.map((skill, s) => {
				if ('SUPPORT' === skill.type) {
					return (
						<div className="Paragraph" key={s}>
							<div><strong>Skill:</strong> {skill.skill.title}</div>
							<div><strong>Healing:</strong> {skill.healing}</div>
							<div><strong>Status:</strong> {formatStatus(skill.status)}</div>
						</div>
					);
				}
				const elm = skill.skill.element;
				return (
					<div className="Paragraph" key={s}>
						<div><strong>Skill:</strong> {skill.skill.title}</div>
						<div><strong>Physical:</strong> {skill.physical}</div>
						<div><strong>Magical:</strong> {skill.magical} {'NONE' !== elm ? `(${elm})` : ''}</div>
						<div><strong>Status:</strong> {formatStatus(skill.status)}</div>
						{combat[0].backAttack && (
							<div>&rsaquo;&nbsp;Back attack</div>
						)}
						<div>&rsaquo;&nbsp;{affinityData[skill.affinity].title}</div>
					</div>
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
