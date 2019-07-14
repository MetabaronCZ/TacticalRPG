export type AIPreset = 'RANK_1' | 'CUSTOM';

export interface IAIConfig {
	readonly key?: any;
}

export interface IAIPresetData {
	readonly title: string;
	readonly config: IAIConfig;
}

export interface IAISettings {
	readonly preset: AIPreset;
	readonly config: IAIConfig;
}
