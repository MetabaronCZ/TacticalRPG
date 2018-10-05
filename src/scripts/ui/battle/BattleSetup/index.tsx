import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';

import PlayerControl from 'data/player-control';
import { playerMaxNameLength, randomPartyID } from 'data/game-config';

import { PartyData } from 'engine/party-data';
import { BattleConfig } from 'engine/battle-config';
import ObservableList from 'engine/observable-list';
import { CharacterData } from 'engine/character-data';

import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';
import CharacterList from 'ui/character-creation/CharacterList';
import BattleConfigform, { BattleSetupEditable } from 'ui/battle/BattleSetup/form';

interface IBattleSetupProps {
	readonly config: BattleConfig;
	readonly parties: ObservableList<PartyData>;
	readonly characters: ObservableList<CharacterData>;
	readonly onStart: (config: BattleConfig) => void;
	readonly onBack: (e: SyntheticEvent<any>) => void;
}

@observer
class BattleSetup extends React.Component<IBattleSetupProps> {
	private formState: BattleConfigform;

	constructor(props: IBattleSetupProps) {
		super(props);

		const { config, parties } = this.props;
		this.formState = new BattleConfigform(config, parties);
	}

	public render() {
		const { state, getPartyCharacters } = this.formState;
		const isValid = this.formState.isValid();

		return (
			<Form onSubmit={this.onSubmit}>
				{state.map((player, p) => {
					const characters = getPartyCharacters(player);
					const fieldName = `f-player-${p}-name`;
					const fieldParty = `f-player-${p}-party`;
					const fieldControl = `f-player-${p}-control`;

					return (
						<React.Fragment key={p}>
							<h2 className="Heading">Player {p + 1}</h2>

							<FormField fieldId={fieldName} label="Name" error={player.errors.name}>
								<FormInput
									id={fieldName}
									type="text"
									value={player.name}
									name={fieldName}
									maxLength={playerMaxNameLength}
									isInvalid={!!player.errors.name}
									onChange={this.onChange(p, 'name')}
								/>
							</FormField>

							<FormField fieldId={fieldControl} label="Control">
								<FormSelect
									id={fieldControl}
									name={fieldControl}
									value={player.control}
									onChange={this.onChange(p, 'control')}
								>
									{PlayerControl.map((id, control, i) => (
										<FormSelectItem value={id} key={i}>
											{control.title}
										</FormSelectItem>
									))}
								</FormSelect>
							</FormField>

							<FormField fieldId={fieldParty} label="Party">
								<FormSelect
									id={fieldParty}
									name={fieldParty}
									value={player.party}
									onChange={this.onChange(p, 'party')}
								>
									{player.parties.map((party, i) => (
										<FormSelectItem value={party.id} key={i}>
											{party.getName()}
										</FormSelectItem>
									))}

									<FormSelectItem value={randomPartyID}>
										Random characters
									</FormSelectItem>
								</FormSelect>
							</FormField>

							<CharacterList characters={characters} />
							<br />

							<Separator />
						</React.Fragment>
					);
				})}

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.props.onBack} />
					{isValid && <Button ico="fight" text="Start" color="green" type="submit" />}
				</ButtonRow>
			</Form>
		);
	}

	private onChange = (player: number, name: BattleSetupEditable) => (e: SyntheticEvent<any>) => {
		const value = e.currentTarget.value;
		this.formState.change(name, player, value);
	}

	private onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		const state = this.formState;

		if (state.isValid() && this.props.onStart) {
			this.props.onStart(state.getConfig());
		}
	}
}

export default BattleSetup;
