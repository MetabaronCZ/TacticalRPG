import Position from 'modules/geometry/position';
import { SkillElement } from 'modules/skill/skill-data';

export type BattleInfoType = 'ACTION' | 'DAMAGE' | 'HEALING' | 'DEBUFF' | 'BUFF';
export type IOnBattleInfo = (info: IBattleInfo) => void;

export interface IBattleInfo {
	readonly text: string;
	readonly position: Position;
	readonly type: BattleInfoType;
	readonly element?: SkillElement;
}
