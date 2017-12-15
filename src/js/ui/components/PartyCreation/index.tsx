import React, { SyntheticEvent } from 'react';

import Link from 'ui/components/Link';
import Form from 'ui/components/Form';
import FormField from 'ui/components/FormField';
import FormInput from 'ui/components/FormInput';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import Separator from 'ui/components/Separator';

import { validateField, validateForm } from 'utils/validation';
import { characterCount, getCharacterById, makeParty, maxNameLength } from 'utils/party';

import Sexes from 'data/sex';
import Jobs from 'data/jobs';
import Weapons from 'data/weapon';
import Armors from 'data/armor';
import { IParty } from 'models/party';
import { ICharacter } from 'models/character';
import { JobID, IJob } from 'models/job';
import { IArmor } from 'models/armor';
import { IWeapon } from 'models/weapon';

interface IPartyCreationProps {
	party?: IParty;
	characters: ICharacter[];
	onBack?: () => void;
	onSubmit: (party: IParty) => void;
}

interface IPartyCreationState {
	fields: IParty;
	errors: {
		[field: string]: string;
	};
}

class PartyCreation extends React.Component {
	public state: IPartyCreationState;
	public props: IPartyCreationProps;

	constructor(props: IPartyCreationProps) {
		super(props);

		this.state = {
			fields: makeParty(props.party || {}),
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.filterCharacters = this.filterCharacters.bind(this);
		this.renderPartyItem = this.renderPartyItem.bind(this);
		this.handleValidationError = this.handleValidationError.bind(this);
	}

	public render() {
		const fields: IParty = this.state.fields;
		const errors: { [field: string]: string } = this.state.errors;
		const partyExists: boolean = !!(this.props.characters && this.props.characters.length);

		return (
			<Form onSubmit={this.onSubmit}>
				{partyExists
					? (
						<div>
							<FormField fieldId="f-name" label="Name" error={errors.name}>
								<FormInput
									id="f-name"
									type="text"
									value={fields.name}
									placeholder="Type party name ..."
									name="name"
									maxLength={maxNameLength}
									isInvalid={!!errors.name}
									onChange={this.onChange}
								/>
							</FormField>

							{Array(characterCount).fill('').map((x: string, i: number) => this.renderPartyItem(i))}
						</div>
					)
					: this.renderNoCharacter()
				}
				<Separator />

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.props.onBack} />

					{partyExists
						? <Button type="submit" ico="success" color="green" text="Save" />
						: <span />
					}
				</ButtonRow>
			</Form>
		);
	}

	private onChange(e: SyntheticEvent<any>) {
		const fields = this.state.fields;
		let field: string = e.currentTarget.name;
		let value: any = e.currentTarget.value;

		validateField(field, value, this.handleValidationError);

		if (field.match(/^character/)) {
			const chars: string[] = fields.characters.slice(0);
			const i: number = parseInt(field.split('-')[1], 10);
			chars[i] = value;
			field = 'characters';
			value = chars;
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

		const isValidForm: boolean = validateForm(this.state.fields, this.handleValidationError);

		if (!isValidForm) {
			return;
		}

		// submit data from all steps
		if (this.props.onSubmit) {
			this.props.onSubmit(this.state.fields);
		}
	}

	private handleValidationError(field: string, error: string|null) {
		this.setState({
			errors: {
				...this.state.errors,
				[field]: (error ? error : undefined)
			}
		});
	}

	private filterCharacters(character?: ICharacter): ICharacter[] {
		const selected: string[] = this.state.fields.characters;
		const characters: ICharacter[] = this.props.characters;

		// filter unselected characters (keep character itself)
		let filtered = characters.filter((char: ICharacter) => {
			return (character && char.id === character.id) || -1 === selected.indexOf(char.id);
		});

		// get selected jobs
		const selectedJobs: JobID[] = selected.map((id: string) => {
			const char: ICharacter = getCharacterById(id, characters);
			return char ? char.job : JobID.NONE;
		});

		// filter characters with job not in selection (keep character itself and unused characters with same job)
		filtered = filtered.filter((char: ICharacter) => {
			return (character && char.id === character.id) || (character && char.job === character.job) || -1 === selectedJobs.indexOf(char.job);
		});

		return filtered;
	}

	private renderPartyItem(i: number) {
		const id: string = this.state.fields.characters[i];
		const selected: ICharacter = getCharacterById(id, this.props.characters);
		const characters: ICharacter[] = this.filterCharacters(selected);
		let info: string = '';

		if (selected) {
			const main: IWeapon = Weapons[selected.main];
			const off: IWeapon = Weapons[selected.off];
			const arm: IArmor = Armors[selected.armor];
			const job: IJob = Jobs[selected.job];

			info = `${Sexes[selected.sex].title} ${job.title} | ${main.title} + ${off.title} | ${arm.title}`;
		}
		const fieldId: string = `f-character-${i}`;

		return (
			<FormField fieldId={fieldId} label={`Character ${i + 1}`} info={info} key={i}>
				<FormSelect id={fieldId} name={`character-${i}`} value={id} onChange={this.onChange}>
					<FormSelectItem value="">
						- Empty -
					</FormSelectItem>

					{characters.map((char: ICharacter, j: number) => (
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
}

export default PartyCreation;
