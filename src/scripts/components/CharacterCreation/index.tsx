import React, { SyntheticEvent } from 'react';

import Form from 'components/Form';
import Button from 'components/Button';
import ButtonRow from 'components/ButtonRow';
import Separator from 'components/Separator';

import Step1 from 'components/CharacterCreation/components/Step1';
import Step2 from 'components/CharacterCreation/components/Step2';
import Step3 from 'components/CharacterCreation/components/Step3';

import { validateField, validateForm } from 'utils/validation';

import { Jobs, JobID } from 'modules/job';
import { WieldID } from 'modules/wield';
import { ArmorID, Armors } from 'modules/armor';
import { WeaponID, Weapons } from 'modules/weapon';
import { ICharacterData, CharacterData } from 'modules/character-data';

export interface IStepProps {
	fields: ICharacterData;
	errors: {
		[field: string]: string|undefined;
	};
	onChange: (e?: SyntheticEvent<any>) => void;
}

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

interface IStepData {
	title: string;
	get: (props: IStepProps) => JSX.Element;
}

const stepData: IStepData[] = [
	{
		title: 'Character Identity',
		get: (props: IStepProps) => <Step1 {...props} />
	},
	{
		title: 'Character Archetype',
		get: (props: IStepProps) => <Step2 {...props} />
	},
	{
		title: 'Equipment',
		get: (props: IStepProps) => <Step3 {...props} />
	}
];

const firstStep = 1;
const lastStep = 3;

class CharacterCreation extends React.Component<ICharacterCreationProps, ICharacterCreationState> {
	constructor(props: ICharacterCreationProps) {
		super(props);

		this.state = {
			step: firstStep,
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
					STEP {step}: {stepData[step - 1].title}
				</h2>

				{this.renderStep()}
				<Separator />

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.onBack} />
					{lastStep === step
						? <Button type="submit" ico="success" color="green" text="Save" />
						: <Button ico="next" text="Next" type="submit" />
					}
				</ButtonRow>
			</Form>
		);
	}

	public componentDidUpdate(prevProps: ICharacterCreationProps, prevState: ICharacterCreationState) {
		const curr = this.state.fields;
		const prev = prevState.fields;
		const newData = { ...curr };
		let shouldUpdate = false;

		// reset jobs / equipment on archetype change
		if (prev.primary !== newData.primary || prev.secondary !== newData.secondary) {
			const jobData = Jobs.filter(newData)[0];
			newData.job = jobData[0];
			newData.skillset = jobData[1].skillsets[0];
			shouldUpdate = true;
		}

		// reset main hand weapon / armor on job change
		if (prev.job !== newData.job) {
			newData.main = (CharacterData.canWieldWeapon(newData, newData.main, WieldID.MAIN) ? newData.main : WeaponID.NONE);
			newData.off = (CharacterData.canWieldWeapon(newData, newData.off, WieldID.OFF) ? newData.off : WeaponID.NONE);
			newData.armor = (CharacterData.canWieldArmor(newData, newData.armor) ? newData.armor : ArmorID.NONE);
			shouldUpdate = true;
		}

		// reset character off hand weapon on main hand change
		if (prev.main !== newData.main) {
			newData.off = (CharacterData.canWieldWeapon(newData, newData.off, WieldID.OFF) ? newData.off : WeaponID.NONE);
			shouldUpdate = true;
		}

		// update character data
		if (shouldUpdate) {
			this.setState({
				fields: { ...newData }
			});
		}
	}

	private onBack() {
		const step = this.state.step;
		const onBack = this.props.onBack;

		if (firstStep === step) {
			// exit Character Creation
			if ('function' === typeof onBack) {
				onBack();
			}
		} else {
			// return to previous step
			this.setState({ step: step - 1 });
		}
	}

	private onChange(e?: SyntheticEvent<any>) {
		if (!e) {
			return;
		}
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

		if (step < lastStep) {
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
		const { step, fields, errors } = this.state;

		return stepData[step - 1].get({
			fields,
			errors,
			onChange: this.onChange
		});
	}
}

export default CharacterCreation;
