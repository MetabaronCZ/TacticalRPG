import React from 'react';

import { affinityData } from 'data/combat';

import { ICombatInfo } from 'modules/battle/combat';
import StatusEffect from 'modules/battle/status-effect';

interface IProps {
	readonly combat: ICombatInfo[];
}

const formatStatus = (status: StatusEffect[]) => {
	return status.map(st => st.title).join(', ') || 'none';
};

const CombatInfo: React.SFC<IProps> = ({ combat }) => (
	<div>
		{combat.map((item, i) => {
			const { skill } = item;

			if ('SUPPORT' === item.type) {
				return (
					<div className="Paragraph" key={i}>
						<div><strong>Skill:</strong> {skill.title}</div>
						<div><strong>Healing:</strong> {item.healing}</div>
						<div><strong>Status:</strong> {formatStatus(item.status)}</div>
					</div>
				);
			}
			const elm = skill.element;
			return (
				<div className="Paragraph" key={i}>
					<div><strong>Skill:</strong> {skill.title}</div>
					<div><strong>Physical:</strong> {item.physical}</div>
					<div><strong>Magical:</strong> {item.magical} {'NONE' !== elm ? `(${elm})` : ''}</div>
					<div><strong>Status:</strong> {formatStatus(item.status)}</div>
					{item.backAttack && (
						<div>&rsaquo;&nbsp;Back attack</div>
					)}
					<div>&rsaquo;&nbsp;{affinityData[item.affinity].title}</div>
				</div>
			);
		})}
	</div>
);

export default CombatInfo;
