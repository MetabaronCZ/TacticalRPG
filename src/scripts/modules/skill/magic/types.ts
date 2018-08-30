import { ISkill } from 'modules/skill/types';

type IPartialSkillList<T extends MagicSkillID> = {
	[id in T]: ISkill;
};

export enum MagicSkillID {
	NONE = 'NONE',

	PSYCHOKINESIS_KINETIC_STRIKE = 'PSYCHOKINESIS_KINETIC_STRIKE',
	PSYCHOKINESIS_FORGET = 'PSYCHOKINESIS_FORGET',
	PSYCHOKINESIS_PSYCHODOME = 'PSYCHOKINESIS_PSYCHODOME',

	WHITE_MAGIC_HEAL = 'WHITE_MAGIC_HEAL',
	WHITE_MAGIC_REMEDY = 'WHITE_MAGIC_REMEDY',
	WHITE_MAGIC_REGENERATE = 'WHITE_MAGIC_REGENERATE',
	WHITE_MAGIC_GROUP_HEAL = 'WHITE_MAGIC_GROUP_HEAL',
	WHITE_MAGIC_HOLY_AURA = 'WHITE_MAGIC_HOLY_AURA',
	WHITE_MAGIC_REVIVE = 'WHITE_MAGIC_REVIVE',

	BLACK_MAGIC_DARK_AURA = 'BLACK_MAGIC_DARK_AURA',

	FIRE_MAGIC_FIREBALL = 'FIRE_MAGIC_FIREBALL',
	FIRE_MAGIC_BURN = 'FIRE_MAGIC_BURN',
	FIRE_MAGIC_FIRESTORM = 'FIRE_MAGIC_FIRESTORM',
	FIRE_MAGIC_FIRE_AURA = 'FIRE_MAGIC_FIRE_AURA',

	WATER_MAGIC_SPLASH = 'WATER_MAGIC_SPLASH',
	WATER_MAGIC_SILENCE = 'WATER_MAGIC_SILENCE',
	WATER_MAGIC_FLOOD = 'WATER_MAGIC_FLOOD',
	WATER_MAGIC_WATER_AURA = 'WATER_MAGIC_WATER_AURA',

	WIND_MAGIC_AIR_BLAST = 'WIND_MAGIC_AIR_BLAST',
	WIND_MAGIC_JET_STREAM = 'WIND_MAGIC_JET_STREAM',
	WIND_MAGIC_TORNADO = 'WIND_MAGIC_TORNADO',
	WIND_MAGIC_WIND_AURA = 'WIND_MAGIC_WIND_AURA',

	EARTH_MAGIC_BOULDER = 'EARTH_MAGIC_BOULDER',
	EARTH_MAGIC_EARTH_SPIKE = 'EARTH_MAGIC_EARTH_SPIKE',
	EARTH_MAGIC_EARTHQUAKE = 'EARTH_MAGIC_EARTHQUAKE',
	EARTH_MAGIC_STONE_SKIN = 'EARTH_MAGIC_STONE_SKIN',

	ICE_MAGIC_ICE_SPEAR = 'ICE_MAGIC_ICE_SPEAR',
	ICE_MAGIC_FREEZE = 'ICE_MAGIC_FREEZE',
	ICE_MAGIC_BLIZZARD = 'ICE_MAGIC_BLIZZARD',
	ICE_MAGIC_FROST_AURA = 'ICE_MAGIC_FROST_AURA',

	THUNDER_MAGIC_THUNDERBOLT = 'THUNDER_MAGIC_THUNDERBOLT',
	THUNDER_MAGIC_SHOCK = 'THUNDER_MAGIC_SHOCK',
	THUNDER_MAGIC_THUNDERSTORM = 'THUNDER_MAGIC_THUNDERSTORM',
	THUNDER_MAGIC_THUNDER_AURA = 'THUNDER_MAGIC_THUNDER_AURA'
}

export type IWhiteMagicSkillList = IPartialSkillList<
	MagicSkillID.WHITE_MAGIC_HEAL|
	MagicSkillID.WHITE_MAGIC_REMEDY|
	MagicSkillID.WHITE_MAGIC_REGENERATE|
	MagicSkillID.WHITE_MAGIC_GROUP_HEAL|
	MagicSkillID.WHITE_MAGIC_HOLY_AURA|
	MagicSkillID.WHITE_MAGIC_REVIVE
>;

export type IBlackMagicSkillList = IPartialSkillList<
	MagicSkillID.BLACK_MAGIC_DARK_AURA
>;

export type IFireMagicSkillList = IPartialSkillList<
	MagicSkillID.FIRE_MAGIC_FIREBALL|
	MagicSkillID.FIRE_MAGIC_BURN|
	MagicSkillID.FIRE_MAGIC_FIRESTORM|
	MagicSkillID.FIRE_MAGIC_FIRE_AURA
>;

export type IWaterMagicSkillList = IPartialSkillList<
	MagicSkillID.WATER_MAGIC_SPLASH|
	MagicSkillID.WATER_MAGIC_SILENCE|
	MagicSkillID.WATER_MAGIC_FLOOD|
	MagicSkillID.WATER_MAGIC_WATER_AURA
>;

export type IWindMagicSkillList = IPartialSkillList<
	MagicSkillID.WIND_MAGIC_AIR_BLAST|
	MagicSkillID.WIND_MAGIC_JET_STREAM|
	MagicSkillID.WIND_MAGIC_TORNADO|
	MagicSkillID.WIND_MAGIC_WIND_AURA
>;

export type IEarthMagicSkillList = IPartialSkillList<
	MagicSkillID.EARTH_MAGIC_BOULDER|
	MagicSkillID.EARTH_MAGIC_EARTH_SPIKE|
	MagicSkillID.EARTH_MAGIC_EARTHQUAKE|
	MagicSkillID.EARTH_MAGIC_STONE_SKIN
>;

export type IIceMagicSkillList = IPartialSkillList<
	MagicSkillID.ICE_MAGIC_ICE_SPEAR|
	MagicSkillID.ICE_MAGIC_FREEZE|
	MagicSkillID.ICE_MAGIC_BLIZZARD|
	MagicSkillID.ICE_MAGIC_FROST_AURA
>;

export type IThunderMagicSkillList = IPartialSkillList<
	MagicSkillID.THUNDER_MAGIC_THUNDERBOLT|
	MagicSkillID.THUNDER_MAGIC_SHOCK|
	MagicSkillID.THUNDER_MAGIC_THUNDERSTORM|
	MagicSkillID.THUNDER_MAGIC_THUNDER_AURA
>;

export type IPsychokinesisSkillList = IPartialSkillList<
	MagicSkillID.PSYCHOKINESIS_KINETIC_STRIKE|
	MagicSkillID.PSYCHOKINESIS_FORGET|
	MagicSkillID.PSYCHOKINESIS_PSYCHODOME
>;