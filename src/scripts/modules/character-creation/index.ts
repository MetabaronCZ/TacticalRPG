import { observable, action } from 'mobx';

import { getRandomItem } from 'core/array';
import { IValidation } from 'core/validation';

import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';

import { IEquipSlot } from 'modules/equipment/wield';
import { ArmorID } from 'modules/equipment/armor-data';
import { WeaponID } from 'modules/equipment/weapon-data';
import { SkillsetID } from 'modules/character/skillset-data';
import { CharacterData, ICharacterDataEditable } from 'modules/character-creation/character-data';

interface ICharacterCreation {
	character: CharacterData;
	validation: IValidation<ICharacterDataEditable>;
}

type IFilterCb<T> = (id: T, i: number) => boolean;

class CharacterCreation {
	@observable public state: ICharacterCreation;

	constructor(data: CharacterData|null) {
		this.state = {
			character: new CharacterData(data ? data.serialize() : {}),
			validation: {
				isValid: true,
				errors: {}
			}
		};
	}

	@action
	public change(field: ICharacterDataEditable, value: string) {
		const character = this.state.character;
		character.set(field, value);
		this.state.validation = character.validate();
	}

	@action
	public get(): CharacterData|null {
		const character = this.state.character;
		const validation = character.validate();

		if (!validation.isValid) {
			this.state.validation = validation;
			return null;
		}
		return character;
	}

	@action
	public randomize(): CharacterData {
		const character = this.state.character;

		character.setSex(Sexes.getRandomID() || 'MALE');
		character.setArchetype(Archetypes.getRandomID() || 'PP');

		const skillsets = this.filterSkillsets(id => 'NONE' !== id && character.canUseSkillset(id));
		const skillset = getRandomItem(skillsets);
		character.setSkillset(skillset || 'NONE');

		const mainHands = this.filterWeapons('MAIN', id => 'NONE' !== id && character.canWieldWeapon(id, 'MAIN'));
		const mainHand = getRandomItem(mainHands);
		character.setMainHand(mainHand || 'NONE');

		const offHands = this.filterWeapons('OFF', id => 'NONE' !== id && character.canWieldWeapon(id, 'OFF'));
		const offHand = getRandomItem(offHands);
		character.setOffHand(offHand || 'NONE');

		const armors = this.filterArmors(id => 'NONE' !== id && character.canWieldArmor(id));
		const armor = getRandomItem(armors);
		character.setArmor(armor || 'NONE');

		return character;
	}

	public filterSkillsets(cb?: IFilterCb<SkillsetID>): SkillsetID[] {
		const usable = Skillsets
			.filter(id => this.state.character.canUseSkillset(id))
			.map(([id, skillset]) => id);

		return cb ? usable.filter(cb) : usable;
	}

	public filterWeapons(slot: IEquipSlot, cb?: IFilterCb<WeaponID>): WeaponID[] {
		const equipable = Weapons
			.filter(id => this.state.character.canWieldWeapon(id, slot))
			.map(([id, weapon]) => id);

		return cb ? equipable.filter(cb) : equipable;
	}

	public filterArmors(cb?: IFilterCb<ArmorID>): ArmorID[] {
		const equipable = Armors
			.filter(id => this.state.character.canWieldArmor(id))
			.map(([id, armor]) => id);

		return cb ? equipable.filter(cb) : equipable;
	}
}

export default CharacterCreation;
