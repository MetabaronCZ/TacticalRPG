import React, { SyntheticEvent } from 'react';

import { validateField, validateForm } from 'utils/validation';

import Icos from 'data/icos';
import Sexes from 'data/sexes';
import Wields from 'data/wields';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';
import { characterMaxNameLength } from 'data/game-config';

import { CharacterData } from 'engine/character-data';
import { ArmorID, IArmorData } from 'engine/equipment/armor-data';
import { IWeaponData, WeaponID } from 'engine/equipment/weapon-data';

import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormRadio from 'ui/common/FormRadio';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';

interface ICharacterCreationProps {
	readonly character?: CharacterData;
	readonly onBack?: () => void;
	readonly onSubmit?: (data: CharacterData) => void;
}

interface ICharacterCreationState {
	readonly errors: {
		[field: string]: string|undefined;
	};
}

class CharacterCreation extends React.Component<ICharacterCreationProps, ICharacterCreationState> {
	private character: CharacterData;

	constructor(props: ICharacterCreationProps) {
		super(props);
		this.character = props.character || new CharacterData();

		this.state = {
			errors: {}
		};
	}

	public render() {
		const { character, onChange } = this;
		const { errors } = this.state;

		const data = character.serialize();

		const archetype = Archetypes.get(data.archetype);
		const skillset = Skillsets.get(data.skillset);
		const armor = Armors.get(data.armor);
		const main = Weapons.get(data.main);
		const off = Weapons.get(data.off);
		const mainHandWield = Wields.get('MAIN');
		const offHandWield = Wields.get('OFF');

		const isMagicUser = character.isMagicType();
		const hasNoOffHand = character.isBothWielding() || character.isDualWielding();

		const mainWeapons = character.filterWeapons('MAIN').map(id => [id, Weapons.get(id)] as [WeaponID, IWeaponData]);
		const offWeapons = character.filterWeapons('OFF').map(id => [id, Weapons.get(id)] as [WeaponID, IWeaponData]);
		const armors = character.filterArmors().map(id => [id, Armors.get(id)] as [ArmorID, IArmorData]);

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

	private onChange = (e?: SyntheticEvent<any>) => {
		if (!e) {
			return;
		}
		const { name, value } = e.currentTarget;
		const validation = validateField(name, value);

		const character = new CharacterData({
			...this.character.serialize(),
			[name]: value
		});

		if (!character.isValid()) {
			if (!character.isMagicType() && 'NONE' !== character.getSkillset()) {
				character.setSkillset('NONE');
			}

			if (!character.canWieldWeapon(character.getMainHand(), 'MAIN')) {
				character.setMainHand('NONE');
			}

			if (!character.canWieldWeapon(character.getOffHand(), 'OFF')) {
				character.setOffHand('NONE');
			}

			if (!character.canWieldArmor(character.getArmor())) {
				character.setArmor('NONE');
			}
		}
		this.character = character;

		this.setState(state => ({
			errors: {
				...state.errors,
				[name]: validation.error || undefined
			}
		}));
	}

	private onSubmit = (e: SyntheticEvent<any>) => {
		e.preventDefault();

		const { onSubmit } = this.props;
		const { character } = this;

		if (!character.isValid()) {
			const validation = validateForm(character.serialize());
			this.setState({ errors: validation.errors });
			return;
		}

		if (onSubmit) {
			onSubmit(character);
		}
	}
}

export default CharacterCreation;
