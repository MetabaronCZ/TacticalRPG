import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';

import { Icos, IcoID } from 'data/icos';
import Sexes from 'data/sexes';
import Wields from 'data/wields';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Skillsets from 'data/skillsets';
import Archetypes from 'data/archetypes';
import { maxCharacterNameLength } from 'data/game-config';

import CharacterCreation from 'modules/character-creation';
import { CharacterData, ICharacterDataEditable } from 'modules/character-creation/character-data';

import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormRadio from 'ui/common/FormRadio';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';

interface ICharacterCreationUIProps {
	readonly character: CharacterData|null;
	readonly onBack: () => void;
	readonly onSubmit: (data: CharacterData) => void;
}

@observer
class CharacterCreationUI extends React.Component<ICharacterCreationUIProps> {
	private form: CharacterCreation;

	constructor(props: ICharacterCreationUIProps) {
		super(props);
		this.form = new CharacterCreation(props.character);
	}

	public render() {
		const { form, onChange } = this;
		const { character, validation } = form.state;
		const { name, sex, archetype, skillset, mainHand, offHand, armor } = character;

		const mainHandWield = Wields.get('MAIN');
		const offHandWield = Wields.get('OFF');

		const hasNoOffHand = (character.isBothWielding() || character.isDualWielding());

		const skillsets = form.getSkillsetIDs().map(id => Skillsets.get(id));
		const mainWeapons = form.getWeaponIDs('MAIN').map(id => Weapons.get(id));
		const offWeapons = form.getWeaponIDs('OFF').map(id => Weapons.get(id));
		const armors = form.getArmorIDs().map(id => Armors.get(id));

		return (
			<Form onSubmit={this.onSubmit}>
				<FormField fieldId="f-name" label="Name" error={validation.errors.name}>
					<FormInput
						id="f-name"
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
							<FormSelectItem text={value.title} value={id} key={i} />
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-skillset" label="Magic" info={skillset.description}>
					<FormSelect id="f-skillset" name="skillset" value={skillset.id} disabled={skillsets.length < 2} onChange={onChange('skillset')}>
						{skillsets.map((item, i) => (
							<FormSelectItem text={item.title} value={item.id} key={i} />
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-main" label={mainHandWield.title} info={mainHand.description}>
					<FormSelect id="f-main" name="main" value={mainHand.id} disabled={mainWeapons.length < 2} onChange={onChange('main')}>
						{mainWeapons.map((item, i) => (
							<FormSelectItem text={item.title} value={item.id} key={i} />
						))}
					</FormSelect>
				</FormField>

				<FormField fieldId="f-off" label={offHandWield.title} info={!hasNoOffHand ? offHand.description : undefined}>
					{!hasNoOffHand
						? (
							<FormSelect id="f-off" name="off" value={offHand.id} disabled={offWeapons.length < 2} onChange={onChange('off')}>
								{offWeapons.map((item, i) => (
									<FormSelectItem text={item.title} value={item.id} key={i} />
								))}
							</FormSelect>
						)
						: (
							<FormSelect disabled={true}>
								<FormSelectItem text={mainHand.title} />
							</FormSelect>
						)
					}
				</FormField>

				<FormField fieldId="f-armor" label="Armor" info={armor.description}>
					<FormSelect id="f-armor" name="armor" value={armor.id} disabled={armors.length < 2} onChange={onChange('armor')}>
						{armors.map((item, i) => (
							<FormSelectItem text={item.title} value={item.id} key={i} />
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
			this.form.change(attr, e.currentTarget.value);
		}
	}

	private onSubmit = (e: SyntheticEvent<any>) => {
		e.preventDefault();

		const char = this.form.get();

		if (char) {
			this.props.onSubmit(char);
		}
	}
}

export default CharacterCreationUI;
