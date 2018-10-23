import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';

import { maxPartyNameLength } from 'data/game-config';

import IndexableList from 'modules/indexable-list';
import PartyCreationForm from 'modules/party-creation';
import { CharacterData } from 'modules/character-creation/character-data';
import { PartyData, IPartyDataEditable } from 'modules/party-creation/party-data';

import { formatCharacter } from 'ui/utils';

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
	readonly characters: IndexableList<CharacterData>;
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
		const { characters } = this.props;
		const { party, validation } = this.form.state;
		const canCreateParty = characters.data.length > 0;

		return (
			<Form onSubmit={this.onSubmit}>
				{validation.errors.slots && (
					<p className="ErrorBox">
						{validation.errors.slots}
					</p>
				)}

				{canCreateParty
					? (
						<React.Fragment>
							<FormField fieldId="f-name" label="Name" error={validation.errors.name}>
								<FormInput
									id="f-name"
									value={party.name}
									placeholder="Type party name ..."
									name="name"
									maxLength={maxPartyNameLength}
									isInvalid={!!validation.errors.name}
									onChange={this.onChange('name', null)}
								/>
							</FormField>

							{party.slots.map(this.renderPartyItem)}
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
		const info = formatCharacter(character);
		const fieldId = `f-character-${i}`;

		return (
			<FormField fieldId={fieldId} label={`Character ${i + 1}`} info={info} key={i}>
				<FormSelect id={fieldId} name={`character-${i}`} value={id} onChange={this.onChange('slots', i)}>
					<FormSelectItem text="- Empty -" value="" />

					{filtered.map((char, j) => (
						<FormSelectItem text={char.name} value={char.id} key={j} />
					))}
				</FormSelect>
			</FormField>
		);
	}
}

export default PartyCreationUI;
