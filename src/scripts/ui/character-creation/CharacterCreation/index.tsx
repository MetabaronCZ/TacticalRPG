import React, { SyntheticEvent } from 'react';

import Icos from 'data/icos';
import Sexes from 'data/sexes';
import Wields from 'data/wields';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';
import { characterMaxNameLength } from 'data/game-config';

import { validateField, validateForm } from 'utils/validation';

import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormRadio from 'ui/common/FormRadio';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';

import { ArmorID, IArmorData } from 'engine/equipment/armor-data';
import { IWeaponData, WeaponID } from 'engine/equipment/weapon-data';
import { CharacterData, ICharacterData } from 'engine/character-data';

interface ICharacterCreationProps {
	readonly character?: CharacterData;
	readonly onBack?: () => void;
	readonly onSubmit?: (data: CharacterData) => void;
}

interface ICharacterCreationState {
	readonly fields: {
		character: CharacterData;
	};
	readonly errors: {
		readonly [field: string]: string|undefined;
	};
}

class CharacterCreation extends React.Component<ICharacterCreationProps, ICharacterCreationState> {
	constructor(props: ICharacterCreationProps) {
		super(props);

		this.state = {
			fields: {
				character: props.character || new CharacterData()
			},
			errors: {}
		};
	}

	public render() {
		const onChange = this.onChange;
		const { fields, errors } = this.state;
		const char = fields.character;
		const data = char.serialize();

		const archetype = Archetypes.get(data.archetype);
		const skillset = Skillsets.get(data.skillset);
		const armor = Armors.get(data.armor);
		const main = Weapons.get(data.main);
		const off = Weapons.get(data.off);
		const mainHandWield = Wields.get('MAIN');
		const offHandWield = Wields.get('OFF');

		const isMagicUser = char.isMagicType();
		const hasNoOffHand = char.isBothWielding() || char.isDualWielding();

		const mainWeapons = char.filterWeapons('MAIN').map(id => [id, Weapons.get(id)] as [WeaponID, IWeaponData]);
		const offWeapons = char.filterWeapons('OFF').map(id => [id, Weapons.get(id)] as [WeaponID, IWeaponData]);
		const armors = char.filterArmors().map(id => [id, Armors.get(id)] as [ArmorID, IArmorData]);

		return (
			<Form onSubmit={this.onSubmit}>
				<FormField fieldId="f-name" label="Name" error={errors.name}>
					<FormInput
						id="f-name"
						type="text"
						value={data.name}
						placeholder="Type character name ..."
						name="name"
						maxLength={characterMaxNameLength}
						isInvalid={!!errors.name}
						onChange={onChange}
					/>
				</FormField>

				<FormField fieldId="f-sex" label="Sex" error={errors.sex}>
					{Sexes.map((id, sex, i) => (
						<FormRadio
							id={`f-sex-${id}`}
							label={`${Icos[id.toLocaleLowerCase()]} ${sex ? sex.title : ''}`}
							name="sex"
							value={id}
							isChecked={id === data.sex}
							key={i}
							onChange={onChange}
						/>
					))}
				</FormField>

				<FormField fieldId="f-archetype" label="Archetype" info={archetype.description}>
					<FormSelect id="f-archetype" name="archetype" value={data.archetype} onChange={onChange}>
						{Archetypes.map((id, value, i) => (
							<FormSelectItem value={id} key={i}>
								{value.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-skillset" label="Magic" info={skillset.description}>
					<FormSelect id="f-skillset" name="skillset" value={data.skillset} disabled={!isMagicUser} onChange={onChange}>
						{Skillsets.map((id, set, i) => (
							<FormSelectItem value={id} key={i}>
								{set.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-main" label={mainHandWield.title} info={main.description}>
					<FormSelect id="f-main" name="main" value={data.main} onChange={onChange}>
						{mainWeapons.map(([id, item], i) => (
							<FormSelectItem value={id} key={i}>
								{item.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-off" label={offHandWield.title} info={!hasNoOffHand ? off.description : undefined}>
					{!hasNoOffHand
						? (
							<FormSelect id="f-off" name="off" value={data.off} onChange={onChange}>
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
					<FormSelect id="f-armor" name="armor" value={data.armor} onChange={onChange}>
						{armors.map(([id, item], i) => (
							<FormSelectItem value={id} key={i}>
								{item.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<Separator />

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.props.onBack} />
					<Button type="submit" ico="success" color="green" text="Save" />
				</ButtonRow>
			</Form>
		);
	}

	public componentDidUpdate(prevProps: ICharacterCreationProps, prevState: ICharacterCreationState) {
		const curr = this.state.fields.character;
		const prevData = prevState.fields.character.serialize();
		const newChar = new CharacterData(curr.serialize());
		let newData = newChar.serialize();
		const arch = newData.archetype;
		let shouldUpdate = false;

		// reset character data on archetype change
		if (prevData.archetype !== arch) {
			newChar.setSkillset('NONE');

			if (newChar.isMagicType()) {
				newChar.setSkillset(newData.skillset);
			}
			newChar.setMainHand(newChar.canWieldWeapon(newData.main, 'MAIN') ? newData.main : 'NONE');
			newChar.setOffHand(newChar.canWieldWeapon(newData.off, 'OFF') ? newData.off : 'NONE');
			newChar.setArmor(newChar.canWieldArmor(newData.armor) ? newData.armor : 'NONE');
			shouldUpdate = true;
		}
		newData = newChar.serialize();

		// reset character off hand weapon on main hand change
		if (prevData.main !== newData.main) {
			newChar.setOffHand(newChar.canWieldWeapon(newData.off, 'OFF') ? newData.off : 'NONE');
			shouldUpdate = true;
		}

		// update character data
		if (shouldUpdate) {
			this.setState({ fields: { character: newChar } });
		}
	}

	private onChange = (e?: SyntheticEvent<any>) => {
		if (!e) {
			return;
		}
		const { name, value } = e.currentTarget;
		validateField(name, value, this.handleValidationError);

		this.setState(state => ({
			fields: {
				...state.fields,
				character: new CharacterData({
					...state.fields.character.serialize(),
					[name]: value
				})
			}
		}));
	}

	private onSubmit = (e: SyntheticEvent<any>) => {
		e.preventDefault();

		const { character } = this.state.fields;
		const { onSubmit } = this.props;

		if (!character.isValid()) {
			validateForm(character.serialize(), this.handleValidationError);
			return;
		}

		if (onSubmit) {
			onSubmit(character);
		}
	}

	private handleValidationError = (field: keyof ICharacterData, error: string|null) => {
		this.setState(state => ({
			errors: {
				...state.errors,
				[field]: error || undefined
			}
		}));
	}
}

export default CharacterCreation;
