import React from 'react';

interface IProps {
	readonly id: number;
	readonly align?: 'top' | 'middle' | 'bottom';
}

const PlayerIco: React.SFC<IProps> = ({ id, align = 'bottom'}) => (
	<span className={`PlayerIco PlayerIco--player${id} u-align-${align}`} />
);

export default PlayerIco;
