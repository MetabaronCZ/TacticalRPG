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

		{selected && `SELECTED: [${selected.x}, ${selected.y}]`}
	</div>
);

export default Info;
