import React, { SyntheticEvent } from 'react';

import Link from 'components/Link';
import Form from 'components/Form';
import FormField from 'components/FormField';
import FormInput from 'components/FormInput';
import FormSelect from 'components/FormSelect';
import FormSelectItem from 'components/FormSelectItem';
import Button from 'components/Button';
import ButtonRow from 'components/ButtonRow';
import Separator from 'components/Separator';

import { Sexes } from 'modules/sex';
import { Armors } from 'modules/armor';
import { Weapons } from 'modules/weapon';
import { IParty, Party } from 'modules/party';
import { Archetypes } from 'modules/archetype';
import { ICharacterData, CharacterData } from 'modules/character-data';

import { validateField, validateForm } from 'utils/validation';

const errNoCharacter = 'Party contains no character';

interface IPartyCreationProps {
	party?: IParty;
	characters?: ICharacterData[];
	onBack?: () => void;
	onSubmit: (party: IParty) => void;
}

interface IPartyCreationState {
	fields: IParty;
	errors: {
		[field: string]: string|undefined;
	};
}

class PartyCreation extends React.Component<IPartyCreationProps, IPartyCreationState> {
	constructor(props: IPartyCreationProps) {
		super(props);

		let chars = props.party ? props.party.characters : [];
		chars = chars.filter(id => !!id);

		this.state = {
			fields: Party.create(props.party || {}),
			errors: {
				noCharError: (props.party && !chars.length ? errNoCharacter : undefined)
			}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.filterCharacters = this.filterCharacters.bind(this);
		this.renderPartyItem = this.renderPartyItem.bind(this);
		this.handleValidationError = this.handleValidationError.bind(this);
	}

	public render() {
		const { fields, errors } = this.state;
		const chars = this.props.characters;
		const partyExists = !!(chars && chars.length);

		const partyValidation = errors.noCharError
			? errors.noCharError
			: Party.validate(chars ? fields.characters.map(id => Party.getCharacterById(id, chars)) : undefined);

		return (
			<Form onSubmit={this.onSubmit}>
				{true !== partyValidation ? this.renderInvalidParty(partyValidation) : ''}

				{partyExists
					? (
						<React.Fragment>
							<FormField fieldId="f-name" label="Name" error={errors.name}>
								<FormInput
									id="f-name"
									type="text"
									value={fields.name}
									placeholder="Type party name ..."
									name="name"
									maxLength={Party.maxNameLength}
									isInvalid={!!errors.name}
									onChange={this.onChange}
								/>
							</FormField>

							{Array(Party.characterCount).fill('').map((x, i) => this.renderPartyItem(i))}
						</React.Fragment>
					)
					: this.renderNoCharacter()
				}
				<Separator />

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.props.onBack} />

					{partyExists && true === partyValidation
						? <Button type="submit" ico="success" color="green" text="Save" />
						: <span />
					}
				</ButtonRow>
			</Form>
		);
	}

	private onChange(e: SyntheticEvent<any>) {
		const { fields, errors } = this.state;
		let field = e.currentTarget.name;
		let value = e.currentTarget.value;

		validateField(field, value, this.handleValidationError);

		if (field.match(/^character/)) {
			const chars = fields.characters.slice(0);
			const i = parseInt(field.split('-')[1], 10);
			chars[i] = value;
			field = 'characters';
			value = chars;

			if (value) {
				// reset "no character" validation error
				this.setState({
					errors: {
						...errors,
						noCharError: undefined
					}
				});
			}
		}

		this.setState({
			fields: {
				...fields,
				[field]: value
			}
		});
	}

	private onSubmit(e: SyntheticEvent<any>) {
		e.preventDefault();

		const { fields, errors } = this.state;
		const isValidForm = validateForm(fields, this.handleValidationError);

		if (!isValidForm) {
			return;
		}
		let ids = fields.characters;
		ids = ids.filter(id => !!id);

		if (!ids.length) {
			this.setState({
				errors: {
					...errors,
					noCharError: errNoCharacter
				}
			});
			return;
		}

		// submit data from all steps
		if (this.props.onSubmit) {
			this.props.onSubmit(this.state.fields);
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

	private filterCharacters(character?: ICharacterData): ICharacterData[] {
		const selected = this.state.fields.characters;
		const characters = this.props.characters;

		if (!characters) {
			return [];
		}

		// filter unselected characters (keep character itself)
		return characters.filter(char => {
			return (character && char.id === character.id) || -1 === selected.indexOf(char.id);
		});
	}

	private renderPartyItem(i: number) {
		const id = this.state.fields.characters[i] || '';
		const characters = this.props.characters;
		const selected = (characters ? Party.getCharacterById(id, characters) : undefined);
		const filtered = this.filterCharacters(selected);
		let info = '';

		if (selected) {
			const main = Weapons.get(selected.main);
			const off = Weapons.get(selected.off);
			const arm = Armors.get(selected.armor);
			const sex = Sexes.get(selected.sex);
			const arch = Archetypes.get(selected.archetype);
			let weapons = '';

			if (CharacterData.isBothWielding(selected)) {
				weapons = main.title;
			} else if (CharacterData.isDualWielding(selected)) {
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

	private renderNoCharacter() {
		return (
			<p className="Paragraph">
				You must <Link href="/character-create">create a character</Link> to form a party.
			</p>
		);
	}

	private renderInvalidParty(msg: string|true) {
		return (
			<p className="ErrorBox">
				Party is Invalid: {msg}
			</p>
		);
	}
}

export default PartyCreation;
