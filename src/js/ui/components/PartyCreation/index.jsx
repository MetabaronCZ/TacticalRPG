import React from 'react';

import Form from 'ui/components/Form';
import FormField from 'ui/components/FormField';
import FormInput from 'ui/components/FormInput';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import Separator from 'ui/components/Separator';

import { validateField, validateForm } from 'utils/validation';
import { characterCount, getCharacterById, getDefaultParty, maxNameLength } from 'utils/party';

import sex from 'data/sex';
import characterClass from 'data/class';
import weapon from 'data/weapon';
import armor from 'data/armor';

class PartyCreation extends React.Component {
	constructor(props){
		super(props);

		let party = props.party || {};
		let defaultParty = getDefaultParty();
		let fields = Object.assign({}, defaultParty, party);

		this.state = {
			fields: fields,
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.filterCharacters = this.filterCharacters.bind(this);
		this.renderPartyItem = this.renderPartyItem.bind(this);
		this.handleValidationError = this.handleValidationError.bind(this);
	}

	onChange(e){
		let fields = this.state.fields;
		let field = e.target.name;
		let value = e.target.value;

		validateField(field, value, this.handleValidationError);
		let i;
		if ( field.match(/^character/) ){
			i = parseInt(field.split('-')[1], 10);
			let chars = fields.characters.slice(0);
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

	onSubmit(e){
		e.preventDefault();

		let isValidForm = validateForm(this.state.fields, this.handleValidationError);

		if ( !isValidForm ){
			return;
		}

		// submit data from all steps
		this.props.onSubmit && this.props.onSubmit(this.state.fields);
	}

	handleValidationError(field, error){
		this.setState({
			errors: {
				...this.state.errors,
				[field]: (error ? error : undefined)
			}
		});
	}

	filterCharacters(character = {}){
		let selected = this.state.fields.characters;
		let characters = this.props.characters;

		// filter unselected characters (keep character itself)
		let filtered = characters.filter(char => {
			return (char.id === character.id) || !selected.includes(char.id);
		});

		// get selected character classes
		let selectedClassess = selected.map(id => {
			let char = getCharacterById(id, characters);
			return char ? char.class : null;
		});

		// filter characters with class not in selection (keep character itself and unused characters with same class)
		filtered = filtered.filter(char => {
			return (char.id === character.id) || (char.class === character.class) || !selectedClassess.includes(char.class);
		});

		return filtered;
	}

	renderPartyItem(i){
		let id = this.state.fields.characters[i];
		let selected = getCharacterById(id, this.props.characters);
		let characters = this.filterCharacters(selected);
		let info;

		if ( selected ){
			let main = weapon[selected.main];
			let off = weapon[selected.off];
			let arm = armor[selected.armor];
			let cls = characterClass[selected.class];

			info = `${sex[selected.sex]} ${cls.title} | ${main.title} + ${off.title} | ${arm.title}`;
		}

		return (
			<FormField label={`Character ${i + 1}`} info={info} key={i}>
				<FormSelect id={`f-character-${i}`} name={`character-${i}`} value={id} onChange={this.onChange}>
					<FormSelectItem value="">
						- Empty -
					</FormSelectItem>

					{characters.map((char, i) => (
						<FormSelectItem value={char.id} key={i}>
							{char.name}
						</FormSelectItem>
					))}
				</FormSelect>
			</FormField>
		);
	}

	render(){
		let fields = this.state.fields;
		let errors = this.state.errors;

		return (
			<Form onSubmit={this.onSubmit}>
				<FormField fieldId="f-name" label="Name" error={errors.name}>
					<FormInput
						id="f-name"
						type="text"
						value={fields.name}
						placeholder="Type party name ..."
						name="name"
						maxLength={maxNameLength}
						isInvalid={errors.name}
						onChange={this.onChange}
					/>
				</FormField>

				{Array(characterCount).fill('').map((x, i) => this.renderPartyItem(i))}

				<Separator />

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.props.onBack} />
					<Button type="submit" ico="success" color="green" text="Save" />
				</ButtonRow>
			</Form>
		);
	}
}

export default PartyCreation;
