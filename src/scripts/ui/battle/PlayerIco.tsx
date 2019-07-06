import React from 'react';
import Player from 'modules/battle/player';

interface IProps {
	player: Player;
}

const PlayerIco: React.SFC<IProps> = ({ player }) => (
	<span
		className={`PlayerIco PlayerIco--player${player.id}`}
		title={player.name}
	/>
);

export default PlayerIco;