import miscSkills from 'data/skills/misc';
import weaponSkills from 'data/skills/weapon';

import { DynamicSkillID } from 'modules/skill/dynamic';
import { WeaponID } from 'modules/equipment/weapon-data';
import { ISkillData, SkillElement } from 'modules/skill/skill-data';

const dynamicSkill = miscSkills.DYNAMIC_SKILL;

type WeaponSkillDataTable = {
	readonly [id in WeaponID]: ISkillData | null;
};

const weaponSkillData: WeaponSkillDataTable = {
	NONE: null,
	FISTS: weaponSkills.FST_ATTACK,
	DAGGER: weaponSkills.DGR_ATTACK,
	SWORD_1H: weaponSkills.S1H_ATTACK,
	AXE_1H: weaponSkills.A1H_ATTACK,
	MACE_1H: weaponSkills.M1H_ATTACK,
	SPEAR: weaponSkills.SPR_ATTACK,
	SWORD_2H: weaponSkills.S2H_ATTACK,
	AXE_2H: weaponSkills.A2H_ATTACK,
	MACE_2H: weaponSkills.M2H_ATTACK,
	ROD: null,
	STAFF: null,
	BOW: weaponSkills.BOW_ATTACK,
	GUN: weaponSkills.GUN_ATTACK,
	SHIELD_SMALL: null,
	SHIELD_LARGE: null
};

const getData = (title: string, weapon: WeaponID, element: SkillElement): ISkillData => {
	const data = weaponSkillData[weapon];

	if (!data) {
		throw new Error(`Invalid weapon given for Dynamic skill definition: ${weapon}`);
	}
	let magMod = 0;

	if (dynamicSkill.magical) {
		magMod = dynamicSkill.magical.modifier;
	}
	return {
		...dynamicSkill,
		title,
		range: data.range,
		area: data.area,
		cost: {
			AP: data.cost.AP || 0,
			MP: dynamicSkill.cost.MP || 0
		},
		physical: data.physical,
		magical: {
			modifier: magMod,
			element
		},
		animation: {
			duration: data.animation.duration
		}
	};
};

const dynamicSkills: { [id in DynamicSkillID]: ISkillData; } = {
	FST_FIR: getData('Flame Strike', 'FISTS', 'FIRE'),
	FST_ICE: getData('Frost Strike', 'FISTS', 'ICE'),
	FST_WND: getData('Wind Strike', 'FISTS', 'WIND'),
	FST_ERT: getData('Stone Strike', 'FISTS', 'EARTH'),
	FST_THU: getData('Thunder Strike', 'FISTS', 'THUNDER'),
	FST_WAT: getData('Water Strike', 'FISTS', 'WATER'),
	FST_HOL: getData('Holy Strike', 'FISTS', 'HOLY'),
	FST_DRK: getData('Dark Strike', 'FISTS', 'DARK'),
	FST_PSY: getData('Kinetic Strike', 'FISTS', 'PSYCHIC'),

	DGR_FIR: getData('Flame Stab', 'DAGGER', 'FIRE'),
	DGR_ICE: getData('Frost Stab', 'DAGGER', 'ICE'),
	DGR_WND: getData('Wind Stab', 'DAGGER', 'WIND'),
	DGR_ERT: getData('Stone Stab', 'DAGGER', 'EARTH'),
	DGR_THU: getData('Thunder Stab', 'DAGGER', 'THUNDER'),
	DGR_WAT: getData('Water Stab', 'DAGGER', 'WATER'),
	DGR_HOL: getData('Holy Stab', 'DAGGER', 'HOLY'),
	DGR_DRK: getData('Dark Stab', 'DAGGER', 'DARK'),
	DGR_PSY: getData('Kinetic Stab', 'DAGGER', 'PSYCHIC'),

	S1H_FIR: getData('Flame Strike', 'SWORD_1H', 'FIRE'),
	S1H_ICE: getData('Frost Strike', 'SWORD_1H', 'ICE'),
	S1H_WND: getData('Wind Strike', 'SWORD_1H', 'WIND'),
	S1H_ERT: getData('Stone Strike', 'SWORD_1H', 'EARTH'),
	S1H_THU: getData('Thunder Strike', 'SWORD_1H', 'THUNDER'),
	S1H_WAT: getData('Water Strike', 'SWORD_1H', 'WATER'),
	S1H_HOL: getData('Holy Strike', 'SWORD_1H', 'HOLY'),
	S1H_DRK: getData('Dark Strike', 'SWORD_1H', 'DARK'),
	S1H_PSY: getData('Kinetic Strike', 'SWORD_1H', 'PSYCHIC'),

	A1H_FIR: getData('Flame Slash', 'AXE_1H', 'FIRE'),
	A1H_ICE: getData('Frost Slash', 'AXE_1H', 'ICE'),
	A1H_WND: getData('Wind Slash', 'AXE_1H', 'WIND'),
	A1H_ERT: getData('Stone Slash', 'AXE_1H', 'EARTH'),
	A1H_THU: getData('Thunder Slash', 'AXE_1H', 'THUNDER'),
	A1H_WAT: getData('Water Slash', 'AXE_1H', 'WATER'),
	A1H_HOL: getData('Holy Slash', 'AXE_1H', 'HOLY'),
	A1H_DRK: getData('Dark Slash', 'AXE_1H', 'DARK'),
	A1H_PSY: getData('Kinetic Slash', 'AXE_1H', 'PSYCHIC'),

	M1H_FIR: getData('Flame Smash', 'MACE_1H', 'FIRE'),
	M1H_ICE: getData('Frost Smash', 'MACE_1H', 'ICE'),
	M1H_WND: getData('Wind Smash', 'MACE_1H', 'WIND'),
	M1H_ERT: getData('Stone Smash', 'MACE_1H', 'EARTH'),
	M1H_THU: getData('Thunder Smash', 'MACE_1H', 'THUNDER'),
	M1H_WAT: getData('Water Smash', 'MACE_1H', 'WATER'),
	M1H_HOL: getData('Holy Smash', 'MACE_1H', 'HOLY'),
	M1H_DRK: getData('Dark Smash', 'MACE_1H', 'DARK'),
	M1H_PSY: getData('Kinetic Smash', 'MACE_1H', 'PSYCHIC'),

	SPR_FIR: getData('Flame Thrust', 'SPEAR', 'FIRE'),
	SPR_ICE: getData('Frost Thrust', 'SPEAR', 'ICE'),
	SPR_WND: getData('Wind Thrust', 'SPEAR', 'WIND'),
	SPR_ERT: getData('Stone Thrust', 'SPEAR', 'EARTH'),
	SPR_THU: getData('Thunder Thrust', 'SPEAR', 'THUNDER'),
	SPR_WAT: getData('Water Thrust', 'SPEAR', 'WATER'),
	SPR_HOL: getData('Holy Thrust', 'SPEAR', 'HOLY'),
	SPR_DRK: getData('Dark Thrust', 'SPEAR', 'DARK'),
	SPR_PSY: getData('Kinetic Thrust', 'SPEAR', 'PSYCHIC'),

	S2H_FIR: getData('Flame Strike', 'SWORD_2H', 'FIRE'),
	S2H_ICE: getData('Frost Strike', 'SWORD_2H', 'ICE'),
	S2H_WND: getData('Wind Strike', 'SWORD_2H', 'WIND'),
	S2H_ERT: getData('Stone Strike', 'SWORD_2H', 'EARTH'),
	S2H_THU: getData('Thunder Strike', 'SWORD_2H', 'THUNDER'),
	S2H_WAT: getData('Water Strike', 'SWORD_2H', 'WATER'),
	S2H_HOL: getData('Holy Strike', 'SWORD_2H', 'HOLY'),
	S2H_DRK: getData('Dark Strike', 'SWORD_2H', 'DARK'),
	S2H_PSY: getData('Kinetic Strike', 'SWORD_2H', 'PSYCHIC'),

	A2H_FIR: getData('Flame Slash', 'AXE_2H', 'FIRE'),
	A2H_ICE: getData('Frost Slash', 'AXE_2H', 'ICE'),
	A2H_WND: getData('Wind Slash', 'AXE_2H', 'WIND'),
	A2H_ERT: getData('Stone Slash', 'AXE_2H', 'EARTH'),
	A2H_THU: getData('Thunder Slash', 'AXE_2H', 'THUNDER'),
	A2H_WAT: getData('Water Slash', 'AXE_2H', 'WATER'),
	A2H_HOL: getData('Holy Slash', 'AXE_2H', 'HOLY'),
	A2H_DRK: getData('Dark Slash', 'AXE_2H', 'DARK'),
	A2H_PSY: getData('Kinetic Slash', 'AXE_2H', 'PSYCHIC'),

	M2H_FIR: getData('Flame Smash', 'MACE_2H', 'FIRE'),
	M2H_ICE: getData('Frost Smash', 'MACE_2H', 'ICE'),
	M2H_WND: getData('Wind Smash', 'MACE_2H', 'WIND'),
	M2H_ERT: getData('Stone Smash', 'MACE_2H', 'EARTH'),
	M2H_THU: getData('Thunder Smash', 'MACE_2H', 'THUNDER'),
	M2H_WAT: getData('Water Smash', 'MACE_2H', 'WATER'),
	M2H_HOL: getData('Holy Smash', 'MACE_2H', 'HOLY'),
	M2H_DRK: getData('Dark Smash', 'MACE_2H', 'DARK'),
	M2H_PSY: getData('Kinetic Smash', 'MACE_2H', 'PSYCHIC'),

	BOW_FIR: getData('Flame Arrow', 'BOW', 'FIRE'),
	BOW_ICE: getData('Frost Arrow', 'BOW', 'ICE'),
	BOW_WND: getData('Wind Arrow', 'BOW', 'WIND'),
	BOW_ERT: getData('Stone Arrow', 'BOW', 'EARTH'),
	BOW_THU: getData('Thunder Arrow', 'BOW', 'THUNDER'),
	BOW_WAT: getData('Water Arrow', 'BOW', 'WATER'),
	BOW_HOL: getData('Holy Arrow', 'BOW', 'HOLY'),
	BOW_DRK: getData('Dark Arrow', 'BOW', 'DARK'),
	BOW_PSY: getData('Kinetic Arrow', 'BOW', 'PSYCHIC'),

	GUN_FIR: getData('Flame Shot', 'GUN', 'FIRE'),
	GUN_ICE: getData('Frost Shot', 'GUN', 'ICE'),
	GUN_WND: getData('Wind Shot', 'GUN', 'WIND'),
	GUN_ERT: getData('Stone Shot', 'GUN', 'EARTH'),
	GUN_THU: getData('Thunder Shot', 'GUN', 'THUNDER'),
	GUN_WAT: getData('Water Shot', 'GUN', 'WATER'),
	GUN_HOL: getData('Holy Shot', 'GUN', 'HOLY'),
	GUN_DRK: getData('Dark Shot', 'GUN', 'DARK'),
	GUN_PSY: getData('Kinetic Shot', 'GUN', 'PSYCHIC')
};

export default dynamicSkills;
