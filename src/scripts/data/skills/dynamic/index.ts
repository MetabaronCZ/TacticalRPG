import miscSkills from 'data/skills/misc';
import weaponSkills from 'data/skills/weapon';

import { DynamicSkillID } from 'modules/skill/dynamic';
import { WeaponID } from 'modules/equipment/weapon-data';
import { ISkillData, SkillElement } from 'modules/skill/skill-data';

const dynamicSkill = miscSkills.DYNAMIC_SKILL;

const weaponSkillData: { [id in WeaponID]: ISkillData | null; } = {
	NONE: null,
	FISTS: weaponSkills.FST_ATTACK,
	DAGGER: weaponSkills.DGR_ATTACK,
	SWORD_1H: weaponSkills.S1H_ATTACK,
	AXE_1H: weaponSkills.A1H_ATTACK,
	HAMMER_1H: weaponSkills.H1H_ATTACK,
	SPEAR: weaponSkills.SPR_ATTACK,
	SWORD_2H: weaponSkills.S2H_ATTACK,
	AXE_2H: weaponSkills.A2H_ATTACK,
	HAMMER_2H: weaponSkills.H2H_ATTACK,
	ROD: null,
	STAFF: null,
	BOW: weaponSkills.BOW_ATTACK,
	GUN: weaponSkills.GUN_ATTACK,
	SHIELD_SMALL: null,
	SHIELD_LARGE: null
};

const getData = (title: string, weapon: WeaponID, element: SkillElement): ISkillData => {
	const data = weaponSkillData[weapon];

	if (null === data) {
		throw new Error(`Invalid weapon given for Dynamic skill definition: ${weapon}`);
	}
	const wpnApCost = data.apCost || 0;
	const dynApCost = dynamicSkill.apCost || 0;
	const dynMpCost = dynamicSkill.mpCost || 0;

	return {
		...dynamicSkill,
		title,
		element,
		apCost: wpnApCost + dynApCost,
		mpCost: dynMpCost,
		range: data.range,
		area: data.area,
		hitScan: data.hitScan,
		isFixedDamage: data.isFixedDamage
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

	H1H_FIR: getData('Flame Smash', 'HAMMER_1H', 'FIRE'),
	H1H_ICE: getData('Frost Smash', 'HAMMER_1H', 'ICE'),
	H1H_WND: getData('Wind Smash', 'HAMMER_1H', 'WIND'),
	H1H_ERT: getData('Stone Smash', 'HAMMER_1H', 'EARTH'),
	H1H_THU: getData('Thunder Smash', 'HAMMER_1H', 'THUNDER'),
	H1H_WAT: getData('Water Smash', 'HAMMER_1H', 'WATER'),
	H1H_HOL: getData('Holy Smash', 'HAMMER_1H', 'HOLY'),
	H1H_DRK: getData('Dark Smash', 'HAMMER_1H', 'DARK'),
	H1H_PSY: getData('Kinetic Smash', 'HAMMER_1H', 'PSYCHIC'),

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

	H2H_FIR: getData('Flame Smash', 'HAMMER_2H', 'FIRE'),
	H2H_ICE: getData('Frost Smash', 'HAMMER_2H', 'ICE'),
	H2H_WND: getData('Wind Smash', 'HAMMER_2H', 'WIND'),
	H2H_ERT: getData('Stone Smash', 'HAMMER_2H', 'EARTH'),
	H2H_THU: getData('Thunder Smash', 'HAMMER_2H', 'THUNDER'),
	H2H_WAT: getData('Water Smash', 'HAMMER_2H', 'WATER'),
	H2H_HOL: getData('Holy Smash', 'HAMMER_2H', 'HOLY'),
	H2H_DRK: getData('Dark Smash', 'HAMMER_2H', 'DARK'),
	H2H_PSY: getData('Kinetic Smash', 'HAMMER_2H', 'PSYCHIC'),

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
