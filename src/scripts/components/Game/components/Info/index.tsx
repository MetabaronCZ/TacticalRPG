import React from 'react';

import { IPosition } from 'models/position';

interface IInfoProps {
	tick: number;
	selected?: IPosition;
}

const Info: React.SFC<IInfoProps> = ({ tick, selected }) => (
	<div className="GameInfo">
		<h2 className="Heading">
			TICK: {tick}
		</h2>

		<p className="Paragraph">
			{selected && `SELECTED: [${selected.x}, ${selected.y}]`}
		</p>
	</div>
);

export default Info;
