import uuid from 'uuid/v1';

import * as ArrayUtils from 'core/array';

import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';

import { SexID } from 'engine/character/sex';
import { IIndexable } from 'engine/indexable';
import { ArmorID } from 'engine/equipment/armor-data';
import { SkillsetID } from 'engine/character/skillset';
import { EquipmentUtils } from 'engine/equipment/utils';
import { WeaponID } from 'engine/equipment/weapon-data';
import { ArchetypeID } from 'engine/character/archetype';

export interface ICharacterData extends IIndexable {
	readonly name: string;
	readonly sex: SexID;
	readonly archetype: ArchetypeID;
	skillset: SkillsetID;
	main: WeaponID;
	off: WeaponID;
	armor: ArmorID;
}

type ICharacterConfig = {
	[attr in keyof ICharacterData]?: ICharacterData[attr];
};

class CharacterDataUtils {
	// get default character properties
	public static init(conf: ICharacterConfig = {}): ICharacterData {
		const now = Date.now();

		const defaultCharacterData: ICharacterData = {
			name: '',
			id: uuid(),
			creationDate: now,
			lastUpdate: now,
			sex: 'MALE',
			archetype: 'PP',
			skillset: 'NONE',
			main: 'NONE',
			off: 'NONE',
			armor: 'NONE'
		};
		return Object.assign({}, defaultCharacterData, conf);
	}

	// returns random character properties
	public static random(name: string): ICharacterData {
		const character = CharacterDataUtils.init({
			name,
			sex: ArrayUtils.getRandomItem(Sexes.keys()),
			archetype: ArrayUtils.getRandomItem(Archetypes.keys()),
			skillset: 'NONE'
		});

		if (CharacterDataUtils.isMagicType(character)) {
			character.skillset = ArrayUtils.getRandomItem(Skillsets.keys());
		}
		let main = Weapons.filter(character, 'MAIN');

		if (main.length > 1) {
			main = main.filter(([id, data]) => id !== 'NONE');
		}
		character.main = ArrayUtils.getRandomItem(main)[0];

		if (
			!EquipmentUtils.isBothWielding(character.main) &&
			!EquipmentUtils.isDualWielding(character.main)
		) {
			let off = Weapons.filter(character, 'OFF');

			if (off.length > 1) {
				off = off.filter(([id, data]) => id !== 'NONE');
			}
			character.off = ArrayUtils.getRandomItem(off)[0];

		} else {
			character.off = 'NONE';
		}
		let arm = Armors.filter(character);

		if (arm.length > 1) {
			arm = arm.filter(([id, data]) => id !== 'NONE');
		}
		character.armor = ArrayUtils.getRandomItem(arm)[0];

		return character;
	}

	public static isPowerType(char: ICharacterData): boolean {
		return -1 !== char.archetype.indexOf('P');
	}

	public static isSpeedType(char: ICharacterData): boolean {
		return -1 !== char.archetype.indexOf('S');
	}

	public static isMagicType(char: ICharacterData): boolean {
		return -1 !== char.archetype.indexOf('M');
	}
}

export default CharacterDataUtils;
