import { EWeaponTypes } from 'models/weapon-types';
import { WieldID } from 'models/wield';

export default interface IWeapon {
	title: string;
	description: string;
	type: EWeaponTypes;
	wield: WieldID[];
}
