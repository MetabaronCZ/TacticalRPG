import React from 'react';

interface IProps {
	id: number;
}

const PlayerIco: React.SFC<IProps> = ({ id }) => (
	<span className={`PlayerIco PlayerIco--player${id}`} />
);

export default PlayerIco;
