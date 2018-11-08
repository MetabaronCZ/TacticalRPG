import Tile from 'modules/geometry/tile';
import { SkillElement } from 'modules/skill/skill-data';

export type BattleInfoType = 'ACTION' | 'DAMAGE' | 'HEALING' | 'DEBUFF' | 'BUFF';
export type IOnBattleInfo = (info: IBattleInfo) => void;

export interface IBattleInfo {
	readonly text: string;
	readonly position: Tile;
	readonly type: BattleInfoType;
	readonly element?: SkillElement;
}
