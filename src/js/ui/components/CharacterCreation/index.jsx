import React from 'react';

import Form from 'ui/components/Form';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import Separator from 'ui/components/Separator';

import Step1 from 'ui/components/CharacterCreation/components/Step1';
import Step2 from 'ui/components/CharacterCreation/components/Step2';
import Step3 from 'ui/components/CharacterCreation/components/Step3';

import { validateField, validateForm } from 'utils/validation';

import { filter as filterJobs } from 'utils/character/jobs';
import { filter as filterWeapon } from 'utils/character/weapon';
import { filter as filterArmor } from 'utils/character/armor';
import { getDefaultCharacter } from 'utils/character';

import { WieldID } from 'models/wield';

const steps = [
	{ title: 'Character Identity', component: Step1 },
	{ title: 'Character Archetype', component: Step2 },
	{ title: 'Equipment', component: Step3 }
];

const defaultCharacter = getDefaultCharacter();

class CharacterCreation extends React.Component {
	constructor(props){
		super(props);

		let character = props.character || {};
		let fields = Object.assign({}, defaultCharacter, character);

		this.state = {
			step: 1,
			fields: fields,
			errors: {}
		};

		this.onBack = this.onBack.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.handleValidationError = this.handleValidationError.bind(this);
	}

	componentWillUpdate(nextProps, nextState){
		let curr = this.state.fields;
		let next = nextState.fields;

		// reset jobs on archetype change
		if ( next.primary !== curr.primary || next.secondary !== curr.secondary ){
			let jobs = filterJobs(next);

			this.setState({
				fields: {
					...next,
					job: jobs[0]
				}
			});
		}

		// reset character Main hand weapon and armor on job change
		if ( next.job !== curr.job ){
			let newArmor = (filterArmor(next).includes(curr.armor) ? curr.armor : defaultCharacter.armor);
			let newMain = (filterWeapon(next, WieldID.MAIN).includes(curr.main) ? curr.main : defaultCharacter.main);

			let tmpNext = { ...next };
			tmpNext.main = newMain;

			let newOff = (filterWeapon(tmpNext, WieldID.OFF).includes(curr.off) ? curr.off : defaultCharacter.off);

			this.setState({
				fields: {
					...next,
					main: newMain,
					off: newOff,
					armor: newArmor
				}
			});
		}

		// reset character Off hand weapon if 2H weapon equiped in Main hand
		if ( next.main !== curr.main ){
			let newOff = ( filterWeapon(next, WieldID.OFF).includes(curr.off) ? curr.off : defaultCharacter.off );

			this.setState({
				fields: {
					...next,
					off: newOff
				}
			});
		}
	}

	onBack(){
		if ( 1 === this.state.step ){
			// exit Character Creation
			this.props.onBack();
		} else {
			// return to previous step 
			this.setState({
				step: this.state.step - 1
			});
		}
	}

	onChange(e){
		let field = e.target.name;
		let value = e.target.value;

		validateField(field, value, this.handleValidationError);

		this.setState({
			fields: {
				...this.state.fields,
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

		if ( this.state.step < steps.length ){
			// go to next step
			this.setState({
				step: this.state.step + 1
			});

		} else {
			// submit data from all steps
			this.props.onSubmit && this.props.onSubmit(this.state.fields);
		}
	}

	handleValidationError(field, error){
		this.setState({
			errors: {
				...this.state.errors,
				[field]: (error ? error : undefined)
			}
		});
	}

	render(){
		let step = this.state.step;
		let StepComponent = steps[step - 1].component;

		let stepProps = {
			fields: this.state.fields,
			errors: this.state.errors,
			onChange: this.onChange
		};

		return (
			<Form onSubmit={this.onSubmit}>
				<h2 className="Heading">
					STEP {step}: {steps[step - 1].title}
				</h2>

				<StepComponent {...stepProps} />
				<Separator />

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.onBack} />
					{
						steps.length === step
							? <Button type="submit" ico="success" color="green" text="Save" />
							: <Button ico="next" text="Next" type="submit" />
					}
				</ButtonRow>
			</Form>
		);
	}
}

export default CharacterCreation;
