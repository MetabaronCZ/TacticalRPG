import { ISkillData } from 'engine/skill';

type PsychokinesisSkillID = 'PSYCHOKINESIS_KINETIC_STRIKE' | 'PSYCHOKINESIS_FORGET' | 'PSYCHOKINESIS_PSYCHODOME';
type WhiteMagicSkillID = 'WHITE_MAGIC_HEAL' | 'WHITE_MAGIC_REMEDY' | 'WHITE_MAGIC_REGENERATE' | 'WHITE_MAGIC_GROUP_HEAL' | 'WHITE_MAGIC_HOLY_AURA' | 'WHITE_MAGIC_REVIVE';
type BlackMagicSkillID = 'BLACK_MAGIC_DARK_AURA';
type FireMagicSkillID = 'FIRE_MAGIC_FIREBALL' | 'FIRE_MAGIC_BURN' | 'FIRE_MAGIC_FIRESTORM' | 'FIRE_MAGIC_FIRE_AURA';
type WaterMagicSkillID = 'WATER_MAGIC_SPLASH' | 'WATER_MAGIC_SILENCE' | 'WATER_MAGIC_FLOOD' | 'WATER_MAGIC_WATER_AURA';
type WindMagicSkillID = 'WIND_MAGIC_AIR_BLAST' | 'WIND_MAGIC_JET_STREAM' | 'WIND_MAGIC_TORNADO' | 'WIND_MAGIC_WIND_AURA';
type EarthMagicSkillID = 'EARTH_MAGIC_BOULDER' | 'EARTH_MAGIC_EARTH_SPIKE' | 'EARTH_MAGIC_EARTHQUAKE' | 'EARTH_MAGIC_STONE_SKIN';
type IceMagicSkillID = 'ICE_MAGIC_ICE_SPEAR' | 'ICE_MAGIC_FREEZE' | 'ICE_MAGIC_BLIZZARD' | 'ICE_MAGIC_FROST_AURA';
type ThunderMagicSkillID = 'THUNDER_MAGIC_THUNDERBOLT' | 'THUNDER_MAGIC_SHOCK' | 'THUNDER_MAGIC_THUNDERSTORM' | 'THUNDER_MAGIC_THUNDER_AURA';

export type MagicSkillID =
	'NONE' | PsychokinesisSkillID |
	WhiteMagicSkillID | BlackMagicSkillID |
	FireMagicSkillID | WaterMagicSkillID |
	WindMagicSkillID | EarthMagicSkillID |
	IceMagicSkillID | ThunderMagicSkillID;

type SkillList<T extends MagicSkillID> = {
	[id in T]: ISkillData;
};

export type IPsychokinesisSkillList = SkillList<PsychokinesisSkillID>;
export type IWhiteMagicSkillList = SkillList<WhiteMagicSkillID>;
export type IBlackMagicSkillList = SkillList<BlackMagicSkillID>;
export type IFireMagicSkillList = SkillList<FireMagicSkillID>;
export type IWaterMagicSkillList = SkillList<WaterMagicSkillID>;
export type IWindMagicSkillList = SkillList<WindMagicSkillID>;
export type IEarthMagicSkillList = SkillList<EarthMagicSkillID>;
export type IIceMagicSkillList = SkillList<IceMagicSkillID>;
export type IThunderMagicSkillList = SkillList<ThunderMagicSkillID>;
