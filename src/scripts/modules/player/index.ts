import { PlayerType } from 'modules/player/types';

const create = (name: string, type: PlayerType) => ({
	name,
	type
});

const Player = {
	create
};

export default Player;
