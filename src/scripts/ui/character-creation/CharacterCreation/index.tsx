import React, { SyntheticEvent } from 'react';

import { Icos, IcoID } from 'data/icos';
import Sexes from 'data/sexes';
import Wields from 'data/wields';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';
import { maxCharacterNameLength } from 'data/game-config';

import { CharacterData, ICharacterDataEditable } from 'engine/character-data';
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
import CharacterCreationForm from 'ui/character-creation/CharacterCreation/form';
import { observer } from 'mobx-react';
import { ISkillsetData, SkillsetID } from 'engine/character/skillset-data';

interface ICharacterCreationProps {
	readonly character: CharacterData|null;
	readonly onBack?: () => void;
	readonly onSubmit?: (data: CharacterData) => void;
}

@observer
class CharacterCreation extends React.Component<ICharacterCreationProps> {
	private form: CharacterCreationForm;

	constructor(props: ICharacterCreationProps) {
		super(props);
		this.form = new CharacterCreationForm(props.character);
	}

	public render() {
		const { onChange } = this;
		const { character, validation } = this.form.state;
		const { name, sex, archetype, skillset, mainHand, offHand, armor } = character;

		const mainHandWield = Wields.get('MAIN');
		const offHandWield = Wields.get('OFF');

		const hasNoOffHand = (character.isBothWielding() || character.isDualWielding());

		const skillsets = character.filterSkillsets().map(id => [id, Skillsets.get(id)] as [SkillsetID, ISkillsetData]);
		const mainWeapons = character.filterWeapons('MAIN').map(id => [id, Weapons.get(id)] as [WeaponID, IWeaponData]);
		const offWeapons = character.filterWeapons('OFF').map(id => [id, Weapons.get(id)] as [WeaponID, IWeaponData]);
		const armors = character.filterArmors().map(id => [id, Armors.get(id)] as [ArmorID, IArmorData]);

		return (
			<Form onSubmit={this.onSubmit}>
				<FormField fieldId="f-name" label="Name" error={validation.errors.name}>
					<FormInput
						id="f-name"
						type="text"
						value={name}
						placeholder="Type character name ..."
						name="name"
						maxLength={maxCharacterNameLength}
						isInvalid={!!validation.errors.name}
						onChange={onChange('name')}
					/>
				</FormField>

				<FormField fieldId="f-sex" label="Sex" error={validation.errors.sex}>
					{Sexes.map((id, sexData, i) => (
						<FormRadio
							id={`f-sex-${id}`}
							label={`${Icos[id.toLocaleLowerCase() as IcoID]} ${sexData.title}`}
							name="sex"
							value={id}
							isChecked={id === sex.id}
							key={i}
							onChange={onChange('sex')}
						/>
					))}
				</FormField>

				<FormField fieldId="f-archetype" label="Archetype" info={archetype.description}>
					<FormSelect id="f-archetype" name="archetype" value={archetype.id} onChange={onChange('archetype')}>
						{Archetypes.map((id, value, i) => (
							<FormSelectItem value={id} key={i}>
								{value.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-skillset" label="Magic" info={skillset.description}>
					<FormSelect id="f-skillset" name="skillset" value={skillset.id} disabled={skillsets.length < 2} onChange={onChange('skillset')}>
						{skillsets.map(([id, set], i) => (
							<FormSelectItem value={id} key={i}>
								{set.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-main" label={mainHandWield.title} info={mainHand.description}>
					<FormSelect id="f-main" name="main" value={mainHand.id} disabled={mainWeapons.length < 2} onChange={onChange('main')}>
						{mainWeapons.map(([id, item], i) => (
							<FormSelectItem value={id} key={i}>
								{item.title}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-off" label={offHandWield.title} info={!hasNoOffHand ? offHand.description : undefined}>
					{!hasNoOffHand
						? (
							<FormSelect id="f-off" name="off" value={offHand.id} disabled={offWeapons.length < 2} onChange={onChange('off')}>
								{offWeapons.map(([id, item], i) => (
									<FormSelectItem value={id} key={i}>
										{item.title}
									</FormSelectItem>
								))}
							</FormSelect>
						)
						: (
							<FormSelect disabled={true}>
								<FormSelectItem>{mainHand.title}</FormSelectItem>
							</FormSelect>
						)
					}
				</FormField>

				<FormField fieldId="f-armor" label="Armor" info={armor.description}>
					<FormSelect id="f-armor" name="armor" value={armor.id} disabled={armors.length < 2} onChange={onChange('armor')}>
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

					{validation.isValid && (
						<Button type="submit" ico="success" color="green" text="Save" />
					)}
				</ButtonRow>
			</Form>
		);
	}

	private onChange = (attr: ICharacterDataEditable) => (e?: SyntheticEvent<any>) => {
		if (e) {
			this.form.onChange(attr, e.currentTarget.value);
		}
	}

	private onSubmit = (e: SyntheticEvent<any>) => {
		e.preventDefault();
		this.form.onSubmit(this.props.onSubmit);
	}
}

export default CharacterCreation;
