import { ArchetypeID } from 'models/archetype';
import { SkillSetID } from 'models/skill-set';

export enum JobID {
	NONE = 'NONE',
	BAR = 'BAR', KNG = 'KNG', DRG = 'DRG', CYB = 'CYB',
	WAR = 'WAR', BRW = 'BRW', HUN = 'HUN', WER = 'WER',
	BLD = 'BLD', PAL = 'PAL', DRK = 'DRK', SPL = 'SPL',
	ROG = 'ROG', RAN = 'RAN', ENT = 'ENT', VMP = 'VMP',
	TRI = 'TRI', MNK = 'MNK', ASA = 'ASA', ALC = 'ALC',
	PSY = 'PSY', PRI = 'PRI', SOR = 'SOR', ELM = 'ELM'
}

export interface IJob {
	readonly title: string;
	readonly description: string;
	readonly archetype: ArchetypeID[];
	readonly skills: SkillSetID[];
}
