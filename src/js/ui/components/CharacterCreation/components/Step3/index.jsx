import React from 'react';

import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';

import { EWieldTypes } from 'models/wield-types';
import Weapons from 'data/weapons';
import Armors from 'data/armors';

import { filter as filterArmor } from 'utils/character/armor';
import { filter as filterWeapon } from 'utils/character/weapon';

const Step3 = ({ fields, onChange }) => {
	let mainWeapons = filterWeapon(fields, EWieldTypes.MAIN);
	let offWeapons = filterWeapon(fields, EWieldTypes.OFF);
	let armors = filterArmor(fields);
	let isBothWielding = (offWeapons.length < 2);

	return (
		<div>
			<FormField fieldId="f-main" label="Main hand" info={fields.main ? Weapons[fields.main].description : null}>
				<FormSelect id="f-main" name="main" value={fields.main} onChange={onChange}>
					{mainWeapons.map((wpn, i) => (
						<FormSelectItem value={wpn} key={i}>
							{Weapons[wpn].title}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>
	
			<FormField fieldId="f-off" label="Off hand" info={!isBothWielding ? Weapons[fields.off].description : null}>
				{
					!isBothWielding
						? (
							<FormSelect id="f-off" name="off" value={fields.off} onChange={onChange}>
								{offWeapons.map((wpn, i) => (
									<FormSelectItem value={wpn} key={i}>
										{Weapons[wpn].title}
									</FormSelectItem>
								))}
							</FormSelect>
						)
						: (
							<FormSelect disabled>
								<FormSelectItem>{Weapons[fields.main].title}</FormSelectItem>
							</FormSelect>
						)
				}
			</FormField>
	
			<FormField fieldId="f-armor" label="Armor" info={fields.armor ? Armors[fields.armor].description : null}>
				<FormSelect id="f-armor" name="armor" value={fields.armor} onChange={onChange}>
					{armors.map((arm, i) => (
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
