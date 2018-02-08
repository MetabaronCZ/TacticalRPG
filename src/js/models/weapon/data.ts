import { WeaponTypeID } from 'models/weapon';
import { WieldID } from 'models/wield';

export default interface IWeaponData {
	readonly title: string;
	readonly description: string;
	readonly type: WeaponTypeID;
	readonly wield: WieldID[];
}
