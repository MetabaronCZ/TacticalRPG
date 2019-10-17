import dynamicSkillTable from 'data/skills/dynamic/table';

import { IWeaponData } from 'modules/equipment/weapon-data';
import Skillset from 'modules/character/skillset';

export type DynamicSkillID =
	'FST_FIR' | 'FST_ICE' | 'FST_WND' | 'FST_ERT' | 'FST_THU' | 'FST_WAT' | 'FST_DRK' | 'FST_HOL' | 'FST_PSY' |
	'DGR_FIR' | 'DGR_ICE' | 'DGR_WND' | 'DGR_ERT' | 'DGR_THU' | 'DGR_WAT' | 'DGR_DRK' | 'DGR_HOL' | 'DGR_PSY' |
	'S1H_FIR' | 'S1H_ICE' | 'S1H_WND' | 'S1H_ERT' | 'S1H_THU' | 'S1H_WAT' | 'S1H_DRK' | 'S1H_HOL' | 'S1H_PSY' |
	'A1H_FIR' | 'A1H_ICE' | 'A1H_WND' | 'A1H_ERT' | 'A1H_THU' | 'A1H_WAT' | 'A1H_DRK' | 'A1H_HOL' | 'A1H_PSY' |
	'M1H_FIR' | 'M1H_ICE' | 'M1H_WND' | 'M1H_ERT' | 'M1H_THU' | 'M1H_WAT' | 'M1H_DRK' | 'M1H_HOL' | 'M1H_PSY' |
	'SPR_FIR' | 'SPR_ICE' | 'SPR_WND' | 'SPR_ERT' | 'SPR_THU' | 'SPR_WAT' | 'SPR_DRK' | 'SPR_HOL' | 'SPR_PSY' |
	'S2H_FIR' | 'S2H_ICE' | 'S2H_WND' | 'S2H_ERT' | 'S2H_THU' | 'S2H_WAT' | 'S2H_DRK' | 'S2H_HOL' | 'S2H_PSY' |
	'A2H_FIR' | 'A2H_ICE' | 'A2H_WND' | 'A2H_ERT' | 'A2H_THU' | 'A2H_WAT' | 'A2H_DRK' | 'A2H_HOL' | 'A2H_PSY' |
	'M2H_FIR' | 'M2H_ICE' | 'M2H_WND' | 'M2H_ERT' | 'M2H_THU' | 'M2H_WAT' | 'M2H_DRK' | 'M2H_HOL' | 'M2H_PSY' |
	'BOW_FIR' | 'BOW_ICE' | 'BOW_WND' | 'BOW_ERT' | 'BOW_THU' | 'BOW_WAT' | 'BOW_DRK' | 'BOW_HOL' | 'BOW_PSY' |
	'GUN_FIR' | 'GUN_ICE' | 'GUN_WND' | 'GUN_ERT' | 'GUN_THU' | 'GUN_WAT' | 'GUN_DRK' | 'GUN_HOL' | 'GUN_PSY';

export const getDynamicSkillID = (weapon: IWeaponData, skillset: Skillset): DynamicSkillID | null => {
	if (!skillset.element) {
		return null;
	}
	const id = dynamicSkillTable[weapon.id][skillset.element];
	return (id ? id as DynamicSkillID : null);
};
