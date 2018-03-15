import React from 'react';
import { Position } from 'models/position';

interface IInfoProps {
	selected?: Position;
}

const Info: React.SFC<IInfoProps> = ({ selected }) => (
	<div className="GameInfo">
		{JSON.stringify(selected, null, '\t')}
	</div>
);

export default Info;
