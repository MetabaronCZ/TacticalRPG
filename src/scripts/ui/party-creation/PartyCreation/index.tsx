import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';

import { validateField } from 'utils/validation';
import { maxPartyNameLength, maxPartySize } from 'data/game-config';

import { PartyData } from 'engine/party-data';
import ObservableList from 'engine/observable-list';
import { CharacterData } from 'engine/character-data';

import Link from 'ui/common/Link';
import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';

const txtPartyError = `Party must contain 1 to ${maxPartySize} characters`;
const txtNameError = 'Field is required';

interface IPartyCreationProps {
	readonly party?: PartyData;
	readonly characters: ObservableList<CharacterData>;
	readonly onBack?: () => void;
	readonly onSubmit: (party: PartyData) => void;
}

interface IPartyCreationState {
	partyNameError?: string;
	partyError?: string;
}

@observer
class PartyCreation extends React.Component<IPartyCreationProps, IPartyCreationState> {
	private party: PartyData;

	constructor(props: IPartyCreationProps) {
		super(props);
		this.party = new PartyData(props.party ? props.party.serialize() : {}, props.characters.data);

		this.state = {
			partyNameError: undefined,
			partyError: undefined
		};
	}

	public render() {
		const { props, state, party } = this;
		const { characters } = props;
		const { partyNameError, partyError } = state;
		const canCreateParty = characters.data.length > 0;
		const partyValidation = partyNameError || partyError;

		return (
			<Form onSubmit={this.onSubmit}>
				{partyError && (
					<p className="ErrorBox">
						Party is Invalid: {partyError}
					</p>
				)}

				{canCreateParty
					? (
						<React.Fragment>
							<FormField fieldId="f-name" label="Name" error={partyNameError}>
								<FormInput
									id="f-name"
									type="text"
									value={party.getName()}
									placeholder="Type party name ..."
									name="name"
									maxLength={maxPartyNameLength}
									isInvalid={!!partyNameError}
									onChange={this.onChange}
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

					{canCreateParty && !partyValidation && (
						<Button type="submit" ico="success" color="green" text="Save" />
					)}
				</ButtonRow>
			</Form>
		);
	}

	private onChange = (e: SyntheticEvent<any>) => {
		const party = this.party;
		const { characters } = this.props;
		const { name: field, value } = e.currentTarget;

		if ('name' === field) {
			// validate name
			party.setName(value);
			this.validateName();

		} else if (field.match(/^character/)) {
			// validate character selection
			const char = characters.data.find(ch => value === ch.id) || null;
			const i = parseInt(field.split('-')[1], 10);
			party.setCharacter(char, i);
			this.validateParty();
		}

		this.forceUpdate();
	}

	private onSubmit = (e: SyntheticEvent<any>) => {
		e.preventDefault();

		const party = this.party;
		const onSubmit = this.props.onSubmit;
		const isValid = (this.validateName() && this.validateParty());

		if (isValid && onSubmit) {
			onSubmit(party);
		}
	}

	private validateName(): boolean {
		const name = this.party.getName();
		const validation = validateField('name', name);
		let err = validation.error;

		if (!err && '' === name.trim()) {
			err = txtNameError;
		}
		this.setState({
			partyNameError: (null === err ? undefined : err)
		});

		return validation.isValid;
	}

	private validateParty(): boolean {
		const characters = this.party.getCharacters().filter(char => null !== char);
		const partySize = characters.length;
		const isValid = (partySize > 0 && partySize <= maxPartySize);

		this.setState(state => ({
			...state,
			partyError: (isValid ? undefined : txtPartyError)
		}));

		return isValid;
	}

	private filterCharacters = (character: CharacterData|null): CharacterData[] => {
		const characters = this.props.characters;
		const selected = this.party.getCharacters()
			.filter(char => null !== char)
			.map(char => char ? char.id : '');

		if (!characters.data.length) {
			return [];
		}

		// filter unselected characters (keep character itself)
		return characters.data.filter(char => {
			return (character && char.id === character.id) || -1 === selected.indexOf(char.id);
		});
	}

	private renderPartyItem = (character: CharacterData|null, i: number) => {
		const id = (character ? character.id : '');
		const filtered = this.filterCharacters(character);
		let info = '';

		if (character) {
			const main = character.mainHand;
			const off = character.offHand;
			const arm = character.armor;
			const sex = character.sex;
			const arch = character.archetype;
			let weapons = '';

			if (character.isBothWielding()) {
				weapons = main.title;
			} else if (character.isDualWielding()) {
				weapons = `${main.title} + ${main.title}`;
			} else {
				weapons = `${main.title} + ${off.title}`;
			}
			info = `${sex.title} ${arch.title} | ${weapons} | ${arm.title}`;
		}

		const fieldId = `f-character-${i}`;

		return (
			<FormField fieldId={fieldId} label={`Character ${i + 1}`} info={info} key={i}>
				<FormSelect id={fieldId} name={`character-${i}`} value={id} onChange={this.onChange}>
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

export default PartyCreation;
