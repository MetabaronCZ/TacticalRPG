import Skill from 'modules/skill';
import Tile from 'modules/geometry/tile';

export type BattleInfoType = 'ACTION' | 'REACTION' | 'DAMAGE' | 'HEALING' | 'DEBUFF' | 'BUFF';
export type IOnBattleInfo = (info: IBattleInfo) => void;

export interface IBattleInfo {
	readonly text: string;
	readonly position: Tile;
	readonly type: BattleInfoType;
	readonly skill: Skill;
}
