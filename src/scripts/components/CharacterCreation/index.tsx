import React, { SyntheticEvent } from 'react';

import Icos from 'data/icos';
import { characterMaxNameLength } from 'data/game-config';
import { validateField, validateForm } from 'utils/validation';

import Form from 'components/Form';
import FormField from 'components/FormField';
import FormInput from 'components/FormInput';
import FormRadio from 'components/FormRadio';
import FormSelect from 'components/FormSelect';
import FormSelectItem from 'components/FormSelectItem';

import Button from 'components/Button';
import ButtonRow from 'components/ButtonRow';
import Separator from 'components/Separator';

import { Sexes } from 'modules/sex';
import { WieldID } from 'modules/wield';
import { Equipment } from 'modules/equipment';
import { Archetypes } from 'modules/archetype';
import { ArmorID, Armors } from 'modules/armor';
import { WeaponID, Weapons } from 'modules/weapon';
import { Skillsets, SkillsetID } from 'modules/skillset';
import { ICharacterData, CharacterData } from 'modules/character-data';

interface ICharacterCreationProps {
	readonly character?: ICharacterData;
	readonly onBack?: () => void;
	readonly onSubmit?: (data: ICharacterData) => void;
}

interface ICharacterCreationState {
	readonly fields: ICharacterData;
	readonly errors: {
		readonly [field: string]: string|undefined;
	};
}

class CharacterCreation extends React.Component<ICharacterCreationProps, ICharacterCreationState> {
	constructor(props: ICharacterCreationProps) {
		super(props);

		this.state = {
			fields: CharacterData.init(props.character || {}),
			errors: {}
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.handleValidationError = this.handleValidationError.bind(this);
	}

	public render() {
		const onChange = this.onChange;
		const { fields, errors } = this.state;

		const archetype = Archetypes.get(fields.archetype);
		const skillset = Skillsets.get(fields.skillset);
		const armor = Armors.get(fields.armor);
		const main = Weapons.get(fields.main);
		const off = Weapons.get(fields.off);

		const isMagicUser = CharacterData.isMagicUser(fields);
		const hasNoOffHand = Equipment.isBothWielding(fields.main) || Equipment.isDualWielding(fields.main);

		return (
			<Form onSubmit={this.onSubmit}>
				<FormField fieldId="f-name" label="Name" error={errors.name}>
					<FormInput
						id="f-name"
						type="text"
						value={fields.name}
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
							isChecked={id === fields.sex}
							key={i}
							onChange={onChange}
						/>
					))}
				</FormField>

				<FormField fieldId="f-archetype" label="Archetype" info={archetype.description}>
					<FormSelect id="f-archetype" name="archetype" value={fields.archetype} onChange={onChange}>
						{Archetypes.map((id, value, i) => (
							<FormSelectItem value={id} key={i}>
								{value.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-skillset" label="Magic" info={skillset.description}>
					<FormSelect id="f-skillset" name="skillset" value={isMagicUser ? fields.skillset : SkillsetID.NONE} disabled={!isMagicUser} onChange={onChange}>
						{Skillsets.map((id, set, i) => (
							<FormSelectItem value={id} key={i}>
								{set.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-main" label="Main hand" info={main.description}>
					<FormSelect id="f-main" name="main" value={fields.main} onChange={onChange}>
						{Weapons.filter(fields, WieldID.MAIN).map(([id, item], i) => (
							<FormSelectItem value={id} key={i}>
								{item.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-off" label="Off hand" info={!hasNoOffHand ? off.description : undefined}>
					{!hasNoOffHand
						? (
							<FormSelect id="f-off" name="off" value={fields.off} onChange={onChange}>
								{Weapons.filter(fields, WieldID.OFF).map(([id, item], i) => (
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
						{Armors.filter(fields).map(([id, item], i) => (
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
		const curr = this.state.fields;
		const prev = prevState.fields;
		const newData = { ...curr };
		const arch = newData.archetype;
		let shouldUpdate = false;

		// reset character data on archetype change
		if (prev.archetype !== arch) {
			if (CharacterData.isMagicUser(newData)) {
				newData.skillset = newData.skillset || SkillsetID.NONE;
			}
			newData.main = (Equipment.checkMainHand(newData.main, arch) ? newData.main : WeaponID.NONE);
			newData.off = (Equipment.checkOffHand(newData.off, arch, newData.main) ? newData.off : WeaponID.NONE);
			newData.armor = (Equipment.checkArmor(newData.armor, arch) ? newData.armor : ArmorID.NONE);
			shouldUpdate = true;
		}

		// reset character off hand weapon on main hand change
		if (prev.main !== newData.main) {
			newData.off = (Equipment.checkOffHand(newData.off, arch, newData.main) ? newData.off : WeaponID.NONE);
			shouldUpdate = true;
		}

		// update character data
		if (shouldUpdate) {
			this.setState({
				fields: { ...newData }
			});
		}
	}

	private onChange(e?: SyntheticEvent<any>) {
		if (!e) {
			return;
		}
		const { name, value } = e.currentTarget;
		validateField(name, value, this.handleValidationError);

		this.setState(state => ({
			fields: {
				...state.fields,
				[name]: value
			}
		}));
	}

	private onSubmit(e: SyntheticEvent<any>) {
		e.preventDefault();

		const isValidForm = validateForm(this.state.fields, this.handleValidationError);

		if (!isValidForm) {
			return;
		}
		const { fields } = this.state;
		const onSubmit = this.props.onSubmit;

		if (onSubmit) {
			onSubmit(fields);
		}
	}

	private handleValidationError(field: string, error: string|null) {
		this.setState(state => ({
			errors: {
				...state.errors,
				[field]: error || undefined
			}
		}));
	}
}

export default CharacterCreation;
