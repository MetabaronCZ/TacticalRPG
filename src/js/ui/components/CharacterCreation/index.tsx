import React, { SyntheticEvent } from 'react';

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
import { makeCharacter } from 'utils/character';

import { WieldID } from 'models/wield';
import { ArmorID, IArmor } from 'models/armor';
import { WeaponID } from 'models/weapon';
import { ICharacter } from 'models/character';
import { JobID } from 'models/job';

const steps: string[] = ['Character Identity', 'Character Archetype', 'Equipment'];

interface ICharacterCreationProps {
	character?: ICharacter;
	onBack?: () => void;
	onSubmit?: (data: ICharacter) => void;
}

interface ICharacterCreationState {
	step: number;
	fields: ICharacter;
	errors: {
		[field: string]: string;
	};
}

class CharacterCreation extends React.Component {
	public props: ICharacterCreationProps;
	public state: ICharacterCreationState;

	constructor(props: ICharacterCreationProps) {
		super(props);

		this.state = {
			step: 1,
			fields: makeCharacter(props.character || {}),
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
		const curr: ICharacter = this.state.fields;
		const next: ICharacter = nextState.fields;

		// reset jobs on archetype change
		if (next.primary !== curr.primary || next.secondary !== curr.secondary) {
			const jobs: JobID[] = filterJobs(next);

			this.setState({
				fields: {
					...next,
					job: jobs[0]
				}
			});
		}

		// reset character Main hand weapon and armor on job change
		if (next.job !== curr.job) {
			const newArmor: ArmorID = (-1 !== filterArmor(next).indexOf(curr.armor) ? curr.armor : ArmorID.NONE);
			const newMain: WeaponID = (-1 !== filterWeapon(next, WieldID.MAIN).indexOf(curr.main) ? curr.main : WeaponID.NONE);

			const tmpNext: ICharacter = { ...next };
			tmpNext.main = newMain;

			const newOff: WeaponID = (-1 !== filterWeapon(tmpNext, WieldID.OFF).indexOf(curr.off) ? curr.off : WeaponID.NONE);

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
		if (next.main !== curr.main) {
			const newOff: WeaponID = (-1 !== filterWeapon(next, WieldID.OFF).indexOf(curr.off) ? curr.off : WeaponID.NONE);

			this.setState({
				fields: {
					...next,
					off: newOff
				}
			});
		}
	}

	private onBack() {
		if (1 === this.state.step) {
			// exit Character Creation
			if ('function' === typeof this.props.onBack) {
				this.props.onBack();
			}
		} else {
			// return to previous step
			this.setState({
				step: this.state.step - 1
			});
		}
	}

	private onChange(e: SyntheticEvent<any>) {
		const field: string = e.currentTarget.name;
		const value: string = e.currentTarget.value;

		validateField(field, value, this.handleValidationError);

		this.setState({
			fields: {
				...this.state.fields,
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

		if (this.state.step < steps.length) {
			// go to next step
			this.setState({
				step: this.state.step + 1
			});

		} else if ('function' === typeof this.props.onSubmit) {
			// submit data from all steps
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

	private renderStep(): JSX.Element {
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
