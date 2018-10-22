import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';

import PlayerControl from 'data/player-control';
import { playerMaxNameLength, randomPartyID } from 'data/game-config';

import { PartyData } from 'modules/party-creation/party-data';
import BattleConfiguration from 'modules/battle-configuration';
import { BattleConfig } from 'modules/battle-configuration/battle-config';
import { CharacterData } from 'modules/character-creation/character-data';
import { IPlayerConfigEditable } from 'modules/battle-configuration/player-config';

import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';
import CharacterList from 'ui/character-creation/CharacterList';

interface IBattleConfigUIProps {
	readonly config?: BattleConfig;
	readonly parties: PartyData[];
	readonly characters: CharacterData[];
	readonly onStart: (config: BattleConfig) => void;
	readonly onBack: (e: SyntheticEvent<any>) => void;
}

@observer
class BattleConfigUI extends React.Component<IBattleConfigUIProps> {
	private form: BattleConfiguration;

	constructor(props: IBattleConfigUIProps) {
		super(props);

		const { config, parties } = this.props;
		this.form = new BattleConfiguration(config, parties);
	}

	public render() {
		const { config, validation } = this.form.state;
		const parties = this.props.parties;

		return (
			<Form onSubmit={this.onSubmit}>
				{config.players.map((player, p) => {
					const characters = this.form.getPartyCharacters(player);
					const errors = validation.errors.players[p];

					const fieldName = `f-player-${p}-name`;
					const fieldParty = `f-player-${p}-party`;
					const fieldControl = `f-player-${p}-control`;

					return (
						<React.Fragment key={p}>
							<h2 className="Heading">Player {p + 1}</h2>

							<FormField fieldId={fieldName} label="Name" error={errors.name}>
								<FormInput
									id={fieldName}
									value={player.name}
									name={fieldName}
									maxLength={playerMaxNameLength}
									isInvalid={!!errors.name}
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
										<FormSelectItem text={control.title} value={id} key={i} />
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
									{parties.map((party, i) => (
										<FormSelectItem text={party.getName()} value={party.id} key={i} />
									))}

									<FormSelectItem text="Random characters" value={randomPartyID} />
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

					{validation.isValid && (
						<Button ico="fight" text="Start" color="green" type="submit" />
					)}
				</ButtonRow>
			</Form>
		);
	}

	private onChange = (player: number, name: IPlayerConfigEditable) => (e: SyntheticEvent<any>) => {
		this.form.onPlayerChange(name, player, e.currentTarget.value);
	}

	private onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.form.onSubmit(this.props.onStart);
	}
}

export default BattleConfigUI;
