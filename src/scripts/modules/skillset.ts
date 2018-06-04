import DataList from 'core/data-list';

import { JobSkillID } from 'modules/skill/job/id';
import { berserkingSkillset } from 'modules/skill/job/berserking';
import { knighthoodSkillset } from 'modules/skill/job/knighthood';
import { supremacySkillset } from 'modules/skill/job/supremacy';
import { programSkillset } from 'modules/skill/job/program';
import { weaponMasterySkillset } from 'modules/skill/job/weapon-mastery';
import { combatSkillset } from 'modules/skill/job/combat';
import { trackingSkillset } from 'modules/skill/job/tracking';
import { lycanthropySkillset } from 'modules/skill/job/lycanthropy';
import { mysticArtSkillset } from 'modules/skill/job/mystic-art';
import { divinitySkillset } from 'modules/skill/job/divinity';
import { corruptionSkillset } from 'modules/skill/job/corruption';
import { flamebladeSkillset } from 'modules/skill/job/blade-flame';
import { waterbladeSkillset } from 'modules/skill/job/blade-water';
import { airbladeSkillset } from 'modules/skill/job/blade-air';
import { stonebladeSkillset } from 'modules/skill/job/blade-stone';
import { frostbladeSkillset } from 'modules/skill/job/blade-frost';
import { thunderbladeSkillset } from 'modules/skill/job/blade-thunder';
import { blitzSkillset } from 'modules/skill/job/blitz';
import { aimSkillset } from 'modules/skill/job/aim';
import { performanceSkillset } from 'modules/skill/job/performance';
import { vampirismSkillset } from 'modules/skill/job/vampirism';
import { illusionSkillset } from 'modules/skill/job/illusion';
import { martialArtsSkillset } from 'modules/skill/job/martial-arts';
import { assassinationSkillset } from 'modules/skill/job/assassination';
import { alchemySkillset } from 'modules/skill/job/alchemy';
import { psychokinesisSkillset } from 'modules/skill/job/psychokinesis';
import { whiteMagicSkillset } from 'modules/skill/job/magic-white';
import { blackMagicSkillset } from 'modules/skill/job/magic-black';
import { fireMagicSkillset } from 'modules/skill/job/magic-fire';
import { waterMagicSkillset } from 'modules/skill/job/magic-water';
import { windMagicSkillset } from 'modules/skill/job/magic-wind';
import { earthMagicSkillset } from 'modules/skill/job/magic-earth';
import { iceMagicSkillset } from 'modules/skill/job/magic-ice';
import { thunderMagicSkillset } from 'modules/skill/job/magic-thunder';

export enum SkillsetID {
	NONE = 'NONE',
	BERSERKING = 'BERSERKING',
	KNIGHTHOOD = 'KNIGHTHOOD',
	SUPREMACY = 'SUPREMACY',
	PROGRAM = 'PROGRAM',
	WEAPON_MASTERY = 'WEAPON_MASTERY',
	COMBAT = 'COMBAT',
	TRACKING = 'TRACKING',
	LYCANTHROPY = 'LYCANTHROPY',
	MYSTIC_ART = 'MYSTIC_ART',
	DIVINITY = 'DIVINITY',
	CORRUPTION = 'CORRUPTION',

	FLAMEBLADE = 'FLAMEBLADE',
	WATERBLADE = 'WATERBLADE',
	AIRBLADE = 'AIRBLADE',
	STONEBLADE = 'STONEBLADE',
	FROSTBLADE = 'FROSTBLADE',
	THUNDERBLADE = 'THUNDERBLADE',

	BLITZ = 'BLITZ',
	AIM = 'AIM',
	PERFORMANCE = 'PERFORMANCE',
	VAMPIRISM = 'VAMPIRISM',
	ILLUSION = 'ILLUSION',
	MARTIAL_ARTS = 'MARTIAL_ARTS',
	ASSASSINATION = 'ASSASSINATION',
	ALCHEMY = 'ALCHEMY',
	PSYCHOKINESIS = 'PSYCHOKINESIS',

	WHITE_MAGIC = 'WHITE_MAGIC',
	BLACK_MAGIC = 'BLACK_MAGIC',
	FIRE_MAGIC = 'FIRE_MAGIC',
	WATER_MAGIC = 'WATER_MAGIC',
	WIND_MAGIC = 'WIND_MAGIC',
	EARTH_MAGIC = 'EARTH_MAGIC',
	ICE_MAGIC = 'ICE_MAGIC',
	THUNDER_MAGIC = 'THUNDER_MAGIC'
}

export interface ISkillset {
	readonly title: string;
	readonly description: string;
	readonly skills: JobSkillID[];
}

export const Skillsets = new DataList<SkillsetID, ISkillset>([
	[SkillsetID.NONE, {
		title: 'none',
		description: 'No skillset',
		skills: []
	}],
	[SkillsetID.BERSERKING, berserkingSkillset],
	[SkillsetID.KNIGHTHOOD, knighthoodSkillset],
	[SkillsetID.SUPREMACY, supremacySkillset],
	[SkillsetID.PROGRAM, programSkillset],
	[SkillsetID.WEAPON_MASTERY, weaponMasterySkillset],
	[SkillsetID.COMBAT, combatSkillset],
	[SkillsetID.TRACKING, trackingSkillset],
	[SkillsetID.LYCANTHROPY, lycanthropySkillset],
	[SkillsetID.MYSTIC_ART, mysticArtSkillset],
	[SkillsetID.DIVINITY, divinitySkillset],
	[SkillsetID.CORRUPTION, corruptionSkillset],
 	[SkillsetID.FLAMEBLADE, flamebladeSkillset],
	[SkillsetID.WATERBLADE, waterbladeSkillset],
	[SkillsetID.AIRBLADE, airbladeSkillset],
	[SkillsetID.STONEBLADE, stonebladeSkillset],
	[SkillsetID.FROSTBLADE, frostbladeSkillset],
	[SkillsetID.THUNDERBLADE, thunderbladeSkillset],
 	[SkillsetID.BLITZ, blitzSkillset],
	[SkillsetID.AIM, aimSkillset],
	[SkillsetID.PERFORMANCE, performanceSkillset],
	[SkillsetID.VAMPIRISM, vampirismSkillset],
	[SkillsetID.ILLUSION, illusionSkillset],
	[SkillsetID.MARTIAL_ARTS, martialArtsSkillset],
	[SkillsetID.ASSASSINATION, assassinationSkillset],
	[SkillsetID.ALCHEMY, alchemySkillset],
	[SkillsetID.PSYCHOKINESIS, psychokinesisSkillset],
	[SkillsetID.WHITE_MAGIC, whiteMagicSkillset],
	[SkillsetID.BLACK_MAGIC, blackMagicSkillset],
	[SkillsetID.FIRE_MAGIC, fireMagicSkillset],
	[SkillsetID.WATER_MAGIC, waterMagicSkillset],
	[SkillsetID.WIND_MAGIC, windMagicSkillset],
	[SkillsetID.EARTH_MAGIC, earthMagicSkillset],
	[SkillsetID.ICE_MAGIC, iceMagicSkillset],
	[SkillsetID.THUNDER_MAGIC, thunderMagicSkillset]
]);
