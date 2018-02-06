import React from 'react';

import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';

import { WieldID } from 'models/wield';
import WeaponList from 'data/weapon-list';
import ArmorList from 'data/armor-list';

import { filter as filterArmor } from 'utils/armor';
import { filter as filterWeapon } from 'utils/weapon';
import { ICharacter } from 'models/character';

interface IStep3Props {
	fields: ICharacter;
	onChange: () => void;
}

const Step3 = ({ fields, onChange }: IStep3Props): JSX.Element => {
	const mainWeapons = filterWeapon(fields, WieldID.MAIN);
	const offWeapons = filterWeapon(fields, WieldID.OFF);
	const armors = filterArmor(fields);
	const armor = ArmorList.get(fields.armor);
	const main = WeaponList.get(fields.main);
	const off = WeaponList.get(fields.off);
	const isBothWielding = (offWeapons.size < 2);

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
					{Array.from(mainWeapons.entries()).map(([id, item], i) => {
						return (
							<FormSelectItem value={id} key={i}>
								{item.title}
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
								{Array.from(offWeapons.entries()).map(([id, item], i) => {
									return (
										<FormSelectItem value={id} key={i}>
											{item.title}
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
					{Array.from(armors.entries()).map(([id, item], i) => {
						return (
							<FormSelectItem value={id} key={i}>
								{item.title}
							</FormSelectItem>
						);
					})}
				</FormSelect>
			</FormField>
		</div>
	);
};

export default Step3;
