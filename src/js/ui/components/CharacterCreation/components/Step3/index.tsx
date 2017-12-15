import React from 'react';

import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';

import { WieldID } from 'models/wield';
import Weapons from 'data/weapon';
import Armors from 'data/armor';

import { filter as filterArmor } from 'utils/character/armor';
import { filter as filterWeapon } from 'utils/character/weapon';
import { ICharacter } from 'models/character';
import { ArmorID } from 'models/armor';
import { WeaponID } from 'models/weapon';

interface IStep3Props {
	fields: ICharacter;
	onChange: () => void;
}

const Step3 = ({ fields, onChange }: IStep3Props): JSX.Element => {
	const mainWeapons: WeaponID[] = filterWeapon(fields, WieldID.MAIN);
	const offWeapons: WeaponID[] = filterWeapon(fields, WieldID.OFF);
	const armors: ArmorID[] = filterArmor(fields);
	const isBothWielding: boolean = (offWeapons.length < 2);

	return (
		<div>
			<FormField fieldId="f-main" label="Main hand" info={fields.main ? Weapons[fields.main].description : undefined}>
				<FormSelect id="f-main" name="main" value={fields.main} onChange={onChange}>
					{mainWeapons.map((wpn: WeaponID, i: number) => (
						<FormSelectItem value={wpn} key={i}>
							{Weapons[wpn].title}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>

			<FormField fieldId="f-off" label="Off hand" info={!isBothWielding ? Weapons[fields.off].description : undefined}>
				{
					!isBothWielding
						? (
							<FormSelect id="f-off" name="off" value={fields.off} onChange={onChange}>
								{offWeapons.map((wpn: WeaponID, i: number) => (
									<FormSelectItem value={wpn} key={i}>
										{Weapons[wpn].title}
									</FormSelectItem>
								))}
							</FormSelect>
						)
						: (
							<FormSelect disabled={true}>
								<FormSelectItem>{Weapons[fields.main].title}</FormSelectItem>
							</FormSelect>
						)
				}
			</FormField>

			<FormField fieldId="f-armor" label="Armor" info={fields.armor ? Armors[fields.armor].description : undefined}>
				<FormSelect id="f-armor" name="armor" value={fields.armor} onChange={onChange}>
					{armors.map((arm: ArmorID, i: number) => (
						<FormSelectItem value={arm} key={i}>
							{Armors[arm].title}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>
		</div>
	);
};

export default Step3;
