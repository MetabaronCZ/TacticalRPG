import React, { SyntheticEvent } from 'react';

import Link from 'components/Link';
import Form from 'components/Form';
import FormField from 'components/FormField';
import FormSelect from 'components/FormSelect';
import FormSelectItem from 'components/FormSelectItem';
import Button from 'components/Button';
import ButtonRow from 'components/ButtonRow';
import Separator from 'components/Separator';
import CharacterList from 'components/CharacterList';

import { IParty, Party } from 'models/party';
import { ICharacterData } from 'models/character-data';

interface IBattleSetupProps {
	parties?: IParty[];
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

		if (!characters || !characters.length || !parties || !parties.length) {
			return this.renderNoParty();
		}
		const selectedParty = parties.filter(p => p.id === fields.party)[0];

		const chars = selectedParty.characters
			.map(id => Party.getCharacterById(id, characters))
			.filter(char => !!char);

		const partyValidation = Party.validate(chars);
		const isValidParty = (true === partyValidation && chars.length);

		return (
			<Form onSubmit={this.onSubmit}>
				{/* party selection */}
				<FormField fieldId="f-party" label="Select party">
					<FormSelect id="f-party" name="party" value={fields.party} onChange={this.onChange}>
						{parties.map((party, i) => (
							<FormSelectItem value={party.id} key={i}>
								{party.name}
							</FormSelectItem>
						))}
					</FormSelect>
				</FormField>

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
