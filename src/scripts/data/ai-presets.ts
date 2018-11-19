import DataList from 'core/data-list';
import { AIPreset, IAIPresetData } from 'modules/ai/settings';

const AIPresets = new DataList<AIPreset, IAIPresetData>({
	RANK_1: {
		title: 'Rank 1',
		config: {}
	},
	CUSTOM: {
		title: 'Custom',
		config: {}
	}
});

export default AIPresets;
