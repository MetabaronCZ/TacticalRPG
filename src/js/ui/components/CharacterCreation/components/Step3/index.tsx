import React from 'react';

import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';

import { WieldID } from 'models/wield';
import WeaponList from 'data/weapon-list';
import ArmorList from 'data/armor-list';

import { filter as filterArmor } from 'utils/character/armor';
import { filter as filterWeapon } from 'utils/character/weapon';
import { ICharacter } from 'models/character';
import { ArmorID, IArmor } from 'models/armor';
import { WeaponID, IWeapon } from 'models/weapon';

interface IStep3Props {
	fields: ICharacter;
	onChange: () => void;
}

const Step3 = ({ fields, onChange }: IStep3Props): JSX.Element => {
	const mainWeapons: WeaponID[] = filterWeapon(fields, WieldID.MAIN);
	const offWeapons: WeaponID[] = filterWeapon(fields, WieldID.OFF);
	const armors: ArmorID[] = filterArmor(fields);
	const armor: IArmor|undefined = ArmorList.get(fields.armor);
	const main: IWeapon|undefined = WeaponList.get(fields.main);
	const off: IWeapon|undefined = WeaponList.get(fields.off);
	const isBothWielding: boolean = (offWeapons.length < 2);

	if (!main) {
		throw new Error('PartyCreation could not render item - invalid main WeaponID');
	}

	if (!off) {
		throw new Error('PartyCreation could not render item - invalid off WeaponID');
	}

	if (!armor) {
		throw new Error('PartyCreation could not render item - invalid ArmorID');
	}

	return (
		<div>
			<FormField fieldId="f-main" label="Main hand" info={main.description}>
				<FormSelect id="f-main" name="main" value={fields.main} onChange={onChange}>
					{mainWeapons.map((wpn: WeaponID, i: number) => {
						const mainItem: IWeapon|undefined = WeaponList.get(wpn);

						return (
							<FormSelectItem value={wpn} key={i}>
								{mainItem ? mainItem.title : ''}
							</FormSelectItem>
						);
					})}
				</FormSelect>
			</FormField>

			<FormField fieldId="f-off" label="Off hand" info={!isBothWielding ? off.description : undefined}>
				{
					!isBothWielding
						? (
							<FormSelect id="f-off" name="off" value={fields.off} onChange={onChange}>
								{offWeapons.map((wpn: WeaponID, i: number) => {
									const offItem: IWeapon|undefined = WeaponList.get(wpn);

									return (
										<FormSelectItem value={wpn} key={i}>
											{offItem ? offItem.title : ''}
										</FormSelectItem>
									);
								})}
							</FormSelect>
						)
						: (
							<FormSelect disabled={true}>
								<FormSelectItem>{main.title}</FormSelectItem>
							</FormSelect>
						)
				}
			</FormField>

			<FormField fieldId="f-armor" label="Armor" info={armor.description}>
				<FormSelect id="f-armor" name="armor" value={fields.armor} onChange={onChange}>
					{armors.map((arm: ArmorID, i: number) => {
						const armorItem: IArmor|undefined = ArmorList.get(arm);

						return (
							<FormSelectItem value={arm} key={i}>
								{armorItem ? armorItem.title : ''}
							</FormSelectItem>
						);
					})}
				</FormSelect>
			</FormField>
		</div>
	);
};

export default Step3;
