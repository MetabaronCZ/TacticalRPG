import DataList from 'models/data-list';
import { JobSkillID } from 'models/skill/job/id';

import { berserkingSkillset } from 'models/skill/job/berserking';
import { knighthoodSkillset } from 'models/skill/job/knighthood';
import { supremacySkillset } from 'models/skill/job/supremacy';
import { programSkillset } from 'models/skill/job/program';
import { weaponMasterySkillset } from 'models/skill/job/weapon-mastery';
import { combatSkillset } from 'models/skill/job/combat';
import { trackingSkillset } from 'models/skill/job/tracking';
import { lycanthropySkillset } from 'models/skill/job/lycanthropy';
import { mysticArtSkillset } from 'models/skill/job/mystic-art';
import { divinitySkillset } from 'models/skill/job/divinity';
import { corruptionSkillset } from 'models/skill/job/corruption';
import { flamebladeSkillset } from 'models/skill/job/blade-flame';
import { waterbladeSkillset } from 'models/skill/job/blade-water';
import { airbladeSkillset } from 'models/skill/job/blade-air';
import { stonebladeSkillset } from 'models/skill/job/blade-stone';
import { frostbladeSkillset } from 'models/skill/job/blade-frost';
import { thunderbladeSkillset } from 'models/skill/job/blade-thunder';
import { blitzSkillset } from 'models/skill/job/blitz';
import { aimSkillset } from 'models/skill/job/aim';
import { performanceSkillset } from 'models/skill/job/performance';
import { vampirismSkillset } from 'models/skill/job/vampirism';
import { illusionSkillset } from 'models/skill/job/illusion';
import { martialArtsSkillset } from 'models/skill/job/martial-arts';
import { assassinationSkillset } from 'models/skill/job/assassination';
import { alchemySkillset } from 'models/skill/job/alchemy';
import { psychokinesisSkillset } from 'models/skill/job/psychokinesis';
import { whiteMagicSkillset } from 'models/skill/job/magic-white';
import { blackMagicSkillset } from 'models/skill/job/magic-black';
import { fireMagicSkillset } from 'models/skill/job/magic-fire';
import { waterMagicSkillset } from 'models/skill/job/magic-water';
import { windMagicSkillset } from 'models/skill/job/magic-wind';
import { earthMagicSkillset } from 'models/skill/job/magic-earth';
import { iceMagicSkillset } from 'models/skill/job/magic-ice';
import { thunderMagicSkillset } from 'models/skill/job/magic-thunder';

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
