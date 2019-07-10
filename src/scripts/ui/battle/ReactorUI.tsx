import React from 'react';

import { affinityData } from 'data/damage';

import Act from 'modules/battle/act';
import Command from 'modules/battle/command';
import StatusEffect from 'modules/battle/status-effect';

import Commands from 'ui/battle/Commands';
import CommandInfo from 'ui/battle/CommandInfo';
import CharacterInfo from 'ui/battle/CharacterInfo';

interface IProps {
	act: Act | null;
	onCommandSelect: (command: Command) => void;
}

const formatStatus = (status: StatusEffect[]) => {
	return status.map(st => st.title).join(', ') || 'none';
};

const ReactorUI: React.SFC<IProps> = ({ act, onCommandSelect }) => {
	if (!act) {
		return <React.Fragment />;
	}
	const reaction = act.phases.REACTION.getReaction();

	if (!reaction) {
		return <React.Fragment />;
	}
	const { reactor, command, combat } = reaction;
	let commands = act.getCommands();
	let info = act.getInfo();

	if ('REACTION' !== act.getPhase()) {
		info = '';
		commands = [];
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

			{!!command && (
				<React.Fragment>
					<CommandInfo command={command} />
					<hr className="Separator" />
				</React.Fragment>
			)}

			{!!info && (
				<p className="Paragraph">{info}</p>
			)}

			{!reactor.isAI() && (
				<Commands commands={commands} onSelect={onCommandSelect} />
			)}
		</div>
	);
};

export default ReactorUI;
