import React from 'react';

import CommandTitle from 'ui/battle/CommandTitle';
import Command, { formatCost } from 'modules/battle/command';

interface IProps {
	readonly command: Command;
}

const CommandInfo: React.SFC<IProps> = ({ command }) => (
	<div className="CommandInfo">
		<p><strong>Command selected:</strong></p>

		<div className="CommandInfo-body">
			<div className="CommandInfo-body-title">
				<CommandTitle command={command} />
			</div>

			<div className="CommandInfo-body-cost">
				{formatCost(command.cost)}
			</div>
		</div>
	</div>
);

export default CommandInfo;
