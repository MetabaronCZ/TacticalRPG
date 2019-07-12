import React from 'react';
import Player from 'modules/battle/player';

interface IProps {
	player?: Player;
}

const PlayerIco: React.SFC<IProps> = ({ player }) => (
	<span
		className={`PlayerIco${player ? ' PlayerIco--player' + player.id : ''}`}
		title={player ? player.name : ''}
	/>
);

export default PlayerIco;
