import DataList from 'core/data-list';
import { IPlayerControlData, PlayerControlID } from 'modules/battle-configuration/player-data';

const PlayerControl = new DataList<PlayerControlID, IPlayerControlData>({
	USER: {
		title: 'User'
	},
	AI: {
		title: 'Computer'
	}
});

export default PlayerControl;
