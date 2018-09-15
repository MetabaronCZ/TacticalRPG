import DataList from 'core/data-list';

export type PlayerControlID = 'HUMAN' | 'AI';

export interface IPlayerControlData {
	title: string;
}

const PlayerControl = new DataList<PlayerControlID, IPlayerControlData>({
	HUMAN: {
		title: 'Human'
	},
	AI: {
		title: 'Computer'
	}
});

export default PlayerControl;
