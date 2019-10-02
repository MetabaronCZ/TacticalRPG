export type PsychokinesisSkillID = 'PSY_MINDBLAST' | 'PSY_CONFUSION';
export type HolyMagicSkillID = 'HOL_HEAL' | 'HOL_REMEDY' | 'HOL_REGENERATE' | 'HOL_GROUP_HEAL' | 'HOL_REVIVE';
export type DarkMagicSkillID = 'DRK_SHADOWBOLT' | 'DRK_SHADOWFLARE' | 'DRK_BERSERK';
export type FireMagicSkillID = 'FIR_FIREBALL' | 'FIR_BURN' | 'FIR_FIRESTORM';
export type WaterMagicSkillID = 'WAT_SPLASH' | 'WAT_SILENCE' | 'WAT_FLOOD';
export type WindMagicSkillID = 'WND_AIR_BLAST' | 'WND_JET_STREAM' | 'WND_TORNADO';
export type EarthMagicSkillID = 'ERT_BOULDER' | 'ERT_EARTH_SPIKE' | 'ERT_EARTHQUAKE';
export type IceMagicSkillID = 'ICE_ICE_SPEAR' | 'ICE_FREEZE' | 'ICE_BLIZZARD';
export type ThunderMagicSkillID = 'THU_THUNDERBOLT' | 'THU_SHOCK' | 'THU_THUNDERSTORM';

export type MagicSkillID =
	PsychokinesisSkillID |
	HolyMagicSkillID | DarkMagicSkillID |
	FireMagicSkillID | WaterMagicSkillID |
	WindMagicSkillID | EarthMagicSkillID |
	IceMagicSkillID | ThunderMagicSkillID;
