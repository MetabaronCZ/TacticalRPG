import React, { SyntheticEvent } from 'react';

import Link from 'ui/components/Link';
import Form from 'ui/components/Form';
import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import Separator from 'ui/components/Separator';
import CharacterList from 'ui/components/CharacterList';

import { getCharacterById, validateParty } from 'models/party/utils';

import { IPartyData } from 'models/party';
import { ICharacterData } from 'models/character';

interface IBattleSetupProps {
	parties?: IPartyData[];
	characters?: ICharacterData[];
	onStart: (fields: any) => void;
	onBack: (e: SyntheticEvent<any>) => void;
}

interface IBattleSetupState {
	fields: {
		party: string|null;
	};
}

class BattleSetup extends React.Component<IBattleSetupProps, IBattleSetupState> {
	constructor(props: IBattleSetupProps) {
		super(props);

		const defaultParty = ((this.props.parties && this.props.parties.length) ? this.props.parties[0].id : null);

		this.state = {
			fields: {
				party: defaultParty
			}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	public render() {
		const { characters, parties } = this.props;
		const fields: any = this.state.fields;
		let selectedParty;
		let chars: ICharacterData[] = [];

		if (!characters || !characters.length) {
			return this.renderNoParty();
		}

		if (parties && parties.length) {
			selectedParty = parties.filter((p) => p.id === fields.party)[0];
			chars = selectedParty.characters.map((id) => getCharacterById(id, characters));
		}
		const partyValidation = validateParty(chars);
		const isValidParty = (true === partyValidation);

		return (
			<Form onSubmit={this.onSubmit}>
				{/* party selection */}
				{parties && parties.length
					? (
						<FormField fieldId="f-party" label="Select party">
							<FormSelect id="f-party" name="party" value={fields.party} onChange={this.onChange}>
								{parties.map((party, i) => (
									<FormSelectItem value={party.id} key={i}>
										{party.name}
									</FormSelectItem>
								))}
							</FormSelect>
						</FormField>
					)
					: this.renderNoParty()
				}

				{/* selected party characters */}
				{
					isValidParty
					? <CharacterList characters={chars} />
					: this.renderPartyInvalid(partyValidation)
				}

				<Separator />

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.props.onBack} />

					{isValidParty
						? <Button ico="fight" text="Start" color="green" type="submit" />
						: <span />
					}
				</ButtonRow>
			</Form>
		);
	}

	private onChange(e: SyntheticEvent<any>) {
		const field = e.currentTarget.name;
		const value = e.currentTarget.value;

		this.setState({
			fields: {
				...this.state.fields,
				[field]: value
			}
		});
	}

	private onSubmit(e: SyntheticEvent<any>) {
		e.preventDefault();

		if ('function' === typeof this.props.onStart) {
			this.props.onStart(this.state.fields);
		}
	}

	private renderNoParty() {
		return (
			<p className="Paragraph">
				You must <Link href="/party-create">form a party</Link> to start a battle.
			</p>
		);
	}

	private renderPartyInvalid(msg: string|true) {
		return (
			<p className="ErrorBox">
				Invalid Party: {msg}
			</p>
		);
	}
}

export default BattleSetup;
