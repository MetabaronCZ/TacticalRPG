import React from 'react';

import Link from 'ui/components/Link';
import Form from 'ui/components/Form';
import FormField from 'ui/components/FormField';
import FormSelect from 'ui/components/FormSelect';
import FormSelectItem from 'ui/components/FormSelectItem';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import Separator from 'ui/components/Separator';
import CharacterList from 'ui/components/CharacterList';

import { getCharacterById } from 'utils/party';

class BattleSetup extends React.Component {
	constructor(props){
		super(props);

		let defaultParty = ((this.props.parties && this.props.parties.length) ? this.props.parties[0].id : null);

		this.state = {
			fields: {
				party: defaultParty
			}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e){
		let field = e.target.name;
		let value = e.target.value;

		this.setState({
			fields: {
				...this.state.fields,
				[field]: value
			}
		});
	}

	onSubmit(e){
		e.preventDefault();
		this.props.onStart && this.props.onStart(this.state.fields);
	}

	renderNoParty(){
		return (
			<p className="Paragraph">
				You must <Link href="/party-create">form a party</Link> to start a battle.
			</p>
		);
	}

	render(){
		let fields = this.state.fields;
		let characters = this.props.characters;
		let parties = this.props.parties;
		let party;
		let chars;

		if ( parties && parties.length ){
			party = parties.filter(p => p.id === fields.party)[0];

			chars = party.characters.map(char => {
				return getCharacterById(char, characters);
			});
		}

		return (
			<Form onSubmit={this.onSubmit}>
				{/* party selection */}
				{
					parties && parties.length
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
				{chars && <CharacterList characters={chars} />}
				
				<Separator />

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.props.onBack} />

					{
						parties && parties.length
						? <Button ico="fight" text="Start" color="green" type="submit" />
						: ''
					}
				</ButtonRow>
			</Form>
		);
	}
}

export default BattleSetup;
