import { PlayerType, IPlayer } from 'modules/player/types';

const create = (type: PlayerType): IPlayer => ({
	type
});

const Player = {
	create
};

export default Player;
