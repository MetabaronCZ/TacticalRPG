import React, { SyntheticEvent } from 'react';

import Sexes from 'data/sexes';
import Armors from 'data/armors';
import Weapons from 'data/weapons';
import Archetypes from 'data/archetypes';
import { maxPartyNameLength, maxPartySize } from 'data/game-config';

import { validateField, validateForm } from 'utils/validation';

import Link from 'ui/common/Link';
import Form from 'ui/common/Form';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';

import Equipment from 'modules/equipment';
import { ICharacterData } from 'modules/character-data/types';

import PartyUtils, { IPartyData } from 'engine/party-data';

const errNoCharacter = 'Party contains no character';

const NoCharacter: React.SFC<{}> = () => (
	<p className="Paragraph">
		You must <Link href="/character-create">create a character</Link> to form a party.
	</p>
);

const InvalidParty: React.SFC<{ msg: string|true }> = ({ msg }) => (
	<p className="ErrorBox">
		Party is Invalid: {msg}
	</p>
);

interface IPartyCreationProps {
	readonly party?: IPartyData;
	readonly characters?: ICharacterData[];
	readonly onBack?: () => void;
	readonly onSubmit: (party: IPartyData) => void;
}

interface IPartyCreationState {
	readonly fields: IPartyData;
	readonly errors: {
		readonly [field: string]: string|undefined;
	};
}

class PartyCreation extends React.Component<IPartyCreationProps, IPartyCreationState> {
	constructor(props: IPartyCreationProps) {
		super(props);

		let chars = props.party ? props.party.characters : [];
		chars = chars.filter(id => !!id);

		this.state = {
			fields: PartyUtils.create(props.party || {}),
			errors: {
				noCharError: (props.party && !chars.length ? errNoCharacter : undefined)
			}
		};
	}

	public render() {
		const { fields, errors } = this.state;
		const chars = this.props.characters;
		const partyExists = !!(chars && chars.length);

		const partyValidation = errors.noCharError
			? errors.noCharError
			: PartyUtils.validate(chars ? fields.characters.map(id => PartyUtils.getCharacterById(id, chars)) : undefined);

		return (
			<Form onSubmit={this.onSubmit}>
				{true !== partyValidation && (
					<InvalidParty msg={partyValidation} />
				)}

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
									maxLength={maxPartyNameLength}
									isInvalid={!!errors.name}
									onChange={this.onChange}
								/>
							</FormField>

							{Array(maxPartySize).fill('').map((x, i) => this.renderPartyItem(i))}
						</React.Fragment>
					)
					: <NoCharacter />
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

	private onChange = (e: SyntheticEvent<any>) => {
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

	private onSubmit = (e: SyntheticEvent<any>) => {
		e.preventDefault();

		const { fields, errors } = this.state;
		const isValidForm = validateForm(fields, this.handleValidationError);

		if (!isValidForm) {
			return;
		}
		const ids = fields.characters.filter(id => !!id);

		if (!ids.length) {
			return this.setState({
				errors: {
					...errors,
					noCharError: errNoCharacter
				}
			});
		}

		// submit data from all steps
		if (this.props.onSubmit) {
			this.props.onSubmit(this.state.fields);
		}
	}

	private handleValidationError = (field: string, error: string|null) => {
		this.setState(state => ({
			errors: {
				...state.errors,
				[field]: error || undefined
			}
		}));
	}

	private filterCharacters = (character?: ICharacterData): ICharacterData[] => {
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

	private renderPartyItem = (i: number) => {
		const id = this.state.fields.characters[i] || '';
		const characters = this.props.characters;
		const selected = (characters ? PartyUtils.getCharacterById(id, characters) : undefined);
		const filtered = this.filterCharacters(selected);
		let info = '';

		if (selected) {
			const main = Weapons.get(selected.main);
			const off = Weapons.get(selected.off);
			const arm = Armors.get(selected.armor);
			const sex = Sexes.get(selected.sex);
			const arch = Archetypes.get(selected.archetype);
			let weapons = '';

			if (Equipment.isBothWielding(selected.main)) {
				weapons = main.title;
			} else if (Equipment.isDualWielding(selected.main)) {
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
