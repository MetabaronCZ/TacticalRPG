export type PsychokinesisSkillID = 'PSY_KINETIC_STRIKE' | 'PSY_CONFUSION' | 'PSY_PSYCHODOME';
export type HolyMagicSkillID = 'HOL_HEAL' | 'HOL_REMEDY' | 'HOL_REGENERATE' | 'HOL_GROUP_HEAL' | 'HOL_HOLY_AURA' | 'HOL_REVIVE';
export type DarkMagicSkillID = 'DRK_DARK_AURA';
export type FireMagicSkillID = 'FIR_FIREBALL' | 'FIR_BURN' | 'FIR_FIRESTORM' | 'FIR_FIRE_AURA';
export type WaterMagicSkillID = 'WAT_SPLASH' | 'WAT_SILENCE' | 'WAT_FLOOD' | 'WAT_WATER_AURA';
export type WindMagicSkillID = 'WND_AIR_BLAST' | 'WND_JET_STREAM' | 'WND_TORNADO' | 'WND_WIND_AURA';
export type EarthMagicSkillID = 'ERT_BOULDER' | 'ERT_EARTH_SPIKE' | 'ERT_EARTHQUAKE' | 'ERT_STONE_SKIN';
export type IceMagicSkillID = 'ICE_ICE_SPEAR' | 'ICE_FREEZE' | 'ICE_BLIZZARD' | 'ICE_FROST_AURA';
export type ThunderMagicSkillID = 'THU_THUNDERBOLT' | 'THU_SHOCK' | 'THU_THUNDERSTORM' | 'THU_THUNDER_AURA';

export type MagicSkillID =
	PsychokinesisSkillID |
	HolyMagicSkillID | DarkMagicSkillID |
	FireMagicSkillID | WaterMagicSkillID |
	WindMagicSkillID | EarthMagicSkillID |
	IceMagicSkillID | ThunderMagicSkillID;
