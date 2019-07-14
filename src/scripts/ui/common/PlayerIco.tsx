import React from 'react';

interface IProps {
	readonly id: number;
}

const PlayerIco: React.SFC<IProps> = ({ id }) => (
	<span className={`PlayerIco PlayerIco--player${id}`} />
);

export default PlayerIco;
