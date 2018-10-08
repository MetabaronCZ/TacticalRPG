import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';

import { maxPartyNameLength } from 'data/game-config';

import ObservableList from 'engine/observable-list';
import { CharacterData } from 'engine/character-data';
import PartyCreationForm from 'engine/party-creation';
import { PartyData, IPartyDataEditable } from 'engine/party-data';

import Link from 'ui/common/Link';
import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';

interface IPartyCreationUIProps {
	readonly party?: PartyData;
	readonly characters: ObservableList<CharacterData>;
	readonly onBack: () => void;
	readonly onSubmit: (party: PartyData) => void;
}

@observer
class PartyCreationUI extends React.Component<IPartyCreationUIProps> {
	private form: PartyCreationForm;

	constructor(props: IPartyCreationUIProps) {
		super(props);
		this.form = new PartyCreationForm(props.party, props.characters.data);
	}

	public render() {
		const { party, validation } = this.form.state;
		const characters = this.props.characters;
		const canCreateParty = characters.data.length > 0;

		return (
			<Form onSubmit={this.onSubmit}>
				{validation.errors.characters && (
					<p className="ErrorBox">
						{validation.errors.characters}
					</p>
				)}

				{canCreateParty
					? (
						<React.Fragment>
							<FormField fieldId="f-name" label="Name" error={validation.errors.name}>
								<FormInput
									id="f-name"
									type="text"
									value={party.getName()}
									placeholder="Type party name ..."
									name="name"
									maxLength={maxPartyNameLength}
									isInvalid={!!validation.errors.name}
									onChange={this.onChange('name', null)}
								/>
							</FormField>

							{party.getCharacters().map(this.renderPartyItem)}
						</React.Fragment>
					)
					: (
						<p className="Paragraph">
							You must <Link href="/character-create">create a character</Link> to form a party.
						</p>
					)
				}
				<Separator />

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.props.onBack} />

					{(canCreateParty && validation.isValid) && (
						<Button type="submit" ico="success" color="green" text="Save" />
					)}
				</ButtonRow>
			</Form>
		);
	}

	private onChange = (attr: IPartyDataEditable, i: number|null) => (e: SyntheticEvent<any>) => {
		this.form.change(attr, i, e.currentTarget.value);
	}

	private onSubmit = (e: SyntheticEvent<any>) => {
		e.preventDefault();

		const party = this.form.get();

		if (party) {
			this.props.onSubmit(party);
		}
	}

	private renderPartyItem = (character: CharacterData|null, i: number) => {
		const filtered = this.form.filterCharacters(character);
		const id = (character ? character.id : '');
		let info = '';

		if (character) {
			const { sex, archetype, mainHand, offHand, armor } = character;
			let weapons = '';

			if (character.isBothWielding()) {
				weapons = mainHand.title;
			} else if (character.isDualWielding()) {
				weapons = `${mainHand.title} + ${mainHand.title}`;
			} else {
				weapons = `${mainHand.title} + ${offHand.title}`;
			}
			info = `${sex.title} ${archetype.title} | ${weapons} | ${armor.title}`;
		}

		const fieldId = `f-character-${i}`;

		return (
			<FormField fieldId={fieldId} label={`Character ${i + 1}`} info={info} key={i}>
				<FormSelect id={fieldId} name={`character-${i}`} value={id} onChange={this.onChange('characters', i)}>
					<FormSelectItem value="">
						- Empty -
					</FormSelectItem>

					{filtered.map((char, j) => (
						<FormSelectItem value={char.id} key={j}>
							{char.name}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>
		);
	}
}

export default PartyCreationUI;
