import React, { SyntheticEvent } from 'react';

import Form from 'components/Form';
import Button from 'components/Button';
import ButtonRow from 'components/ButtonRow';
import Separator from 'components/Separator';

import Step1 from 'components/CharacterCreation/components/Step1';
import Step2 from 'components/CharacterCreation/components/Step2';
import Step3 from 'components/CharacterCreation/components/Step3';

import { validateField, validateForm } from 'utils/validation';

import { Jobs } from 'modules/job';
import { WieldID } from 'modules/wield';
import { ArmorID, Armors } from 'modules/armor';
import { WeaponID, Weapons } from 'modules/weapon';
import { ICharacterData, CharacterData } from 'modules/character-data';

const steps: string[] = ['Character Identity', 'Character Archetype', 'Equipment'];

interface ICharacterCreationProps {
	character?: ICharacterData;
	onBack?: () => void;
	onSubmit?: (data: ICharacterData) => void;
}

interface ICharacterCreationState {
	step: number;
	fields: ICharacterData;
	errors: {
		[field: string]: string|undefined;
	};
}

class CharacterCreation extends React.Component<ICharacterCreationProps, ICharacterCreationState> {
	constructor(props: ICharacterCreationProps) {
		super(props);

		this.state = {
			step: 1,
			fields: CharacterData.init(props.character || {}),
			errors: {}
		};

		this.onBack = this.onBack.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.handleValidationError = this.handleValidationError.bind(this);
	}

	public render() {
		const step = this.state.step;

		return (
			<Form onSubmit={this.onSubmit}>
				<h2 className="Heading">
					STEP {step}: {steps[step - 1]}
				</h2>

				{this.renderStep()}
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

	public componentWillUpdate(nextProps: ICharacterCreationProps, nextState: ICharacterCreationState) {
		const curr = this.state.fields;
		const next = nextState.fields;

		// reset jobs on archetype change
		if (next.primary !== curr.primary || next.secondary !== curr.secondary) {
			const jobs = Jobs.filter(next);

			this.setState({
				fields: {
					...next,
					job: Array.from(jobs.keys())[0]
				}
			});
		}

		if (next.job !== curr.job) {
			// assign skillset
			const newJob = Jobs.get(next.job);
			const newSkillset = newJob.skillsets[0];

			// reset character Main hand weapon and armor on job change
			const newArmor = (Armors.filter(next).has(curr.armor) ? curr.armor : ArmorID.NONE);
			const newMain = (Weapons.filter(next, WieldID.MAIN).has(curr.main) ? curr.main : WeaponID.NONE);

			const tmpNext = { ...next };
			tmpNext.main = newMain;

			const newOff = (Weapons.filter(tmpNext, WieldID.OFF).has(curr.off) ? curr.off : WeaponID.NONE);

			this.setState({
				fields: {
					...next,
					main: newMain,
					off: newOff,
					armor: newArmor,
					skillset: newSkillset
				}
			});
		}

		// reset character Off hand weapon if 2H weapon equiped in Main hand
		if (next.main !== curr.main) {
			const newOff = (Weapons.filter(next, WieldID.OFF).has(curr.off) ? curr.off : WeaponID.NONE);

			this.setState({
				fields: {
					...next,
					off: newOff
				}
			});
		}
	}

	private onBack() {
		const step = this.state.step;
		const onBack = this.props.onBack;

		if (1 === step) {
			// exit Character Creation
			if ('function' === typeof onBack) {
				onBack();
			}
		} else {
			// return to previous step
			this.setState({ step: step - 1 });
		}
	}

	private onChange(e: SyntheticEvent<any>) {
		const { name, value } = e.currentTarget;
		validateField(name, value, this.handleValidationError);

		this.setState(state => ({
			fields: {
				...state.fields,
				[name]: value
			}
		}));
	}

	private onSubmit(e: SyntheticEvent<any>) {
		e.preventDefault();

		const isValidForm = validateForm(this.state.fields, this.handleValidationError);

		if (!isValidForm) {
			return;
		}
		const { step, fields } = this.state;
		const onSubmit = this.props.onSubmit;

		if (step < steps.length) {
			// go to next step
			this.setState({ step: step + 1 });

		} else if ('function' === typeof onSubmit) {
			// submit data from all steps
			onSubmit(fields);
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

	private renderStep() {
		const stepProps: any = {
			fields: this.state.fields,
			errors: this.state.errors,
			onChange: this.onChange
		};

		switch (this.state.step) {
			case 1:
				return <Step1 {...stepProps} />;
			case 2:
				return <Step2 {...stepProps} />;
			case 3:
				return <Step3 {...stepProps} />;
			default:
				throw new Error(`CharacterCreation step out of range: ${this.state.step}`);
		}
	}
}

export default CharacterCreation;
