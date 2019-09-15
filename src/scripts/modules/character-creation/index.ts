import { observable, action } from 'mobx';

import { getRandomItem } from 'core/array';
import { IValidation } from 'core/validation';

import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';

import { ArmorID } from 'modules/equipment/armor-data';
import { WeaponID } from 'modules/equipment/weapon-data';
import { IEquipSlot } from 'modules/equipment/wield-data';
import { SkillsetID } from 'modules/character/skillset-data';
import { CharacterData, ICharacterDataEditable, ICharacterData } from 'modules/character-creation/character-data';

interface ICharacterCreation {
	character: CharacterData;
	validation: IValidation<ICharacterDataEditable>;
}

class CharacterCreation {
	@observable public state: ICharacterCreation;

	constructor(data: ICharacterData | null) {
		this.state = {
			character: new CharacterData(data || {}),
			validation: {
				isValid: true,
				errors: {}
			}
		};
	}

	@action
	public change(field: ICharacterDataEditable, value: string): void {
		const character = this.state.character;
		character.set(field, value);
		this.state.validation = character.validate();
	}

	@action
	public get(): ICharacterData | null {
		const character = this.state.character;
		const validation = character.validate();

		if (!validation.isValid) {
			this.state.validation = validation;
			return null;
		}
		return character.serialize();
	}

	@action
	public randomize(): CharacterData {
		const char = this.state.character;

		const sexes = Sexes.keys();
		const sex = getRandomItem(sexes);
		char.setSex(sex || 'MALE');

		const archetypes = Archetypes.keys();
		const archetype = getRandomItem(archetypes);
		char.setArchetype(archetype || 'PP');

		const skillsets = this.getSkillsetIDs().filter(id => 'NONE' !== id);
		const skillset = getRandomItem(skillsets);
		char.setSkillset(skillset || 'NONE');

		const mainHands = this.getWeaponIDs('MAIN').filter(id => 'NONE' !== id);
		const mainHand = getRandomItem(mainHands);
		char.setMainHand(mainHand || 'NONE');

		const offHands = this.getWeaponIDs('OFF').filter(id => 'NONE' !== id);
		const offHand = getRandomItem(offHands);
		char.setOffHand(offHand || 'NONE');

		const armors = this.getArmorIDs().filter(id => 'NONE' !== id);
		const armor = getRandomItem(armors);
		char.setArmor(armor || 'NONE');

		return char;
	}

	public getSkillsetIDs(): SkillsetID[] {
		const char = this.state.character;
		return Skillsets.keys().filter(id => char.canUseSkillset(id));
	}

	public getWeaponIDs(slot: IEquipSlot): WeaponID[] {
		const char = this.state.character;
		return Weapons.keys().filter(id => char.canWieldWeapon(id, slot));
	}

	public getArmorIDs(): ArmorID[] {
		const char = this.state.character;
		return Armors.keys().filter(id => char.canWieldArmor(id));
	}
}

export default CharacterCreation;
