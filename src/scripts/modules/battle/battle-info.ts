import Tile from 'modules/geometry/tile';
import { SkillElement } from 'modules/skill/skill-data';
import { WeaponID } from 'modules/equipment/weapon-data';
import { StatusEffectID } from 'modules/battle/status-effect';

export type BattleInfoType = 'ACTION' | 'REACTION' | 'DAMAGE' | 'HEALING' | 'DEBUFF' | 'BUFF';
export type IOnBattleInfo = (info: IBattleInfo) => void;

export interface IBattleInfo {
	readonly text: string;
	readonly position: Tile;
	readonly type: BattleInfoType;
	readonly weapon?: WeaponID;
	readonly element?: SkillElement;
	readonly status?: StatusEffectID;
}
