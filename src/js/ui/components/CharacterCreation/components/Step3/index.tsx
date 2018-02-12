import React from 'react';

import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';

import { Armors } from 'models/armor';
import { Weapons } from 'models/weapon';
import { WieldID } from 'models/wield';
import { ICharacterData } from 'models/character';

interface IStep3Props {
	fields: ICharacterData;
	onChange: () => void;
}

const Step3: React.SFC<IStep3Props> = ({ fields, onChange }) => {
	const mainWeapons = Weapons.filter(fields, WieldID.MAIN);
	const offWeapons = Weapons.filter(fields, WieldID.OFF);
	const armors = Armors.filter(fields);
	const armor = Armors.get(fields.armor);
	const main = Weapons.get(fields.main);
	const off = Weapons.get(fields.off);
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
					{mainWeapons.map((id, item, i) => {
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
								{offWeapons.map((id, item, i) => {
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
					{armors.map((id, item, i) => {
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
