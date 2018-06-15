import React from 'react';

import FormField from 'components/FormField';
import FormSelect from 'components/FormSelect';
import FormSelectItem from 'components/FormSelectItem';

import { Armors } from 'modules/armor';
import { Weapons } from 'modules/weapon';
import { WieldID } from 'modules/wield';
import { ICharacterData, CharacterData } from 'modules/character-data';

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
	const hasNoOffHand = CharacterData.isBothWielding(fields) || CharacterData.isDualWielding(fields);

	return (
		<React.Fragment>
			<FormField fieldId="f-main" label="Main hand" info={main.description}>
				<FormSelect id="f-main" name="main" value={fields.main} onChange={onChange}>
					{mainWeapons.map(([id, item], i) => (
						<FormSelectItem value={id} key={i}>
							{item.title}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>

			<FormField fieldId="f-off" label="Off hand" info={!hasNoOffHand ? off.description : undefined}>
				{
					!hasNoOffHand
						? (
							<FormSelect id="f-off" name="off" value={fields.off} onChange={onChange}>
								{offWeapons.map(([id, item], i) => (
									<FormSelectItem value={id} key={i}>
										{item.title}
									</FormSelectItem>
								))}
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
					{armors.map(([id, item], i) => (
						<FormSelectItem value={id} key={i}>
							{item.title}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>
		</React.Fragment>
	);
};

export default Step3;
