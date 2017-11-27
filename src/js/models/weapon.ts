import { EWeaponTypes } from 'models/weapon-types';
import { EWieldTypes } from 'models/wield-types';

export default interface IWeapon {
	title: string;
	description: string;
	type: EWeaponTypes;
	wield: EWieldTypes[];
}
