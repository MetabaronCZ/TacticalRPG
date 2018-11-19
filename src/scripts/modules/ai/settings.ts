export type AIPreset = 'RANK_1' | 'CUSTOM';

export interface IAIConfig {
	key?: any;
}

export interface IAIPresetData {
	title: string;
	config: IAIConfig;
}

export interface IAISettings {
	preset: AIPreset;
	config: IAIConfig;
}
