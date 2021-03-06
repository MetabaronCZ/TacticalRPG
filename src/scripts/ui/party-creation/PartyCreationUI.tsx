import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';

import { maxPartyNameLength } from 'data/game-config';

import { getPath } from 'modules/route';
import PartyCreationForm from 'modules/party-creation';
import { ICharacterData } from 'modules/character-creation/character-data';
import { IPartyData, IPartyDataEditable } from 'modules/party-creation/party-data';

import Link from 'ui/common/Link';
import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';

import { formatCharacter } from 'ui/format';
import PartyPreview from 'ui/party-creation/PartyPreview';

interface IPartyCreationUIProps {
	readonly party?: IPartyData;
	readonly characters: ICharacterData[];
	readonly onBack: () => void;
	readonly onSubmit: (party: IPartyData) => void;
}

const getLabel = (i: number, id: string | null): React.ReactNode => (
	<React.Fragment>
		Character {i + 1}
		{' '}
		{!!id && (
			<React.Fragment>
				(<Link href={getPath('CHARACTER_EDIT', id)}>Edit</Link>)
			</React.Fragment>
		)}
	</React.Fragment>
);

@observer
class PartyCreationUI extends React.Component<IPartyCreationUIProps> {
	private form: PartyCreationForm;

	constructor(props: IPartyCreationUIProps) {
		super(props);
		this.form = new PartyCreationForm(props.party, props.characters);
	}

	public render(): React.ReactNode {
		const { characters } = this.props;
		const { party, validation } = this.form.state;
		const canCreateParty = characters.length > 0;

		const preview = party.slots.map(id => {
			return characters.find(char => id === char.id) || null;
		});

		return (
			<div>
				{canCreateParty && (
					<PartyPreview slots={preview} />
				)}

				<Form onSubmit={this.onSubmit}>
					{!!validation.errors.slots && (
						<p className="ErrorBox">
							{validation.errors.slots}
						</p>
					)}

					{canCreateParty
						? (
							<React.Fragment>
								<FormField fieldId="f-name" label="Party name" error={validation.errors.name}>
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
								You must <Link href={getPath('CHARACTER_CREATE')}>create a character</Link> to form a party.
							</p>
						)
					}
					<Separator />

					<ButtonRow>
						<Button ico="back" text="Back" onClick={this.props.onBack} />

						{canCreateParty && (
							<Button type="submit" ico="success" color="green" text="Save" />
						)}
					</ButtonRow>
				</Form>
			</div>
		);
	}

	private onChange = (attr: IPartyDataEditable, i: number | null) => (e: SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => {
		this.form.change(attr, i, e.currentTarget.value);
	}

	private onSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
		e.preventDefault();

		const party = this.form.get();

		if (party) {
			this.props.onSubmit(party);
		}
	}

	private renderPartyItem = (id: string | null, i: number): React.ReactNode => {
		const character = this.props.characters.find(char => id === char.id) || null;
		const filtered = this.form.filterCharacters(character);
		const info = formatCharacter(character);
		const fieldId = `f-character-${i}`;

		return (
			<FormField fieldId={fieldId} label={getLabel(i, id)} info={info} key={i}>
				<FormSelect id={fieldId} name={`character-${i}`} value={id || ''} onChange={this.onChange('slots', i)}>
					<FormSelectItem text="- Empty -" value="" />

					{filtered.map(char => (
						<FormSelectItem text={char.name} value={char.id} key={char.id} />
					))}
				</FormSelect>
			</FormField>
		);
	}
}

export default PartyCreationUI;
