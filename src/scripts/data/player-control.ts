import DataList from 'core/data-list';
import { IPlayerControlData, PlayerControlID } from 'engine/player-config';

const PlayerControl = new DataList<PlayerControlID, IPlayerControlData>({
	HUMAN: {
		title: 'Human'
	},
	AI: {
		title: 'Computer'
	}
});

export default PlayerControl;
