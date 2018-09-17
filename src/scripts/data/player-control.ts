import DataList from 'core/data-list';
import { PlayerControlID, IPlayerControlData } from 'engine/player-control';

const PlayerControl = new DataList<PlayerControlID, IPlayerControlData>({
	HUMAN: {
		title: 'Human'
	},
	AI: {
		title: 'Computer'
	}
});

export default PlayerControl;
