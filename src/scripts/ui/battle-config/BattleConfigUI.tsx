import React, { SyntheticEvent } from 'react';
import { observer } from 'mobx-react';

import PlayerControl from 'data/player-control';
import { playerMaxNameLength, randomPartyID } from 'data/game-config';

import { IAISettings } from 'modules/ai/settings';
import { IPartyData } from 'modules/party-creation/party-data';
import BattleConfiguration from 'modules/battle-configuration';
import { BattleConfig } from 'modules/battle-configuration/battle-config';
import { ICharacterData } from 'modules/character-creation/character-data';
import { IPlayerDataEditable } from 'modules/battle-configuration/player-data';

import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';
import AISettingsUI from 'ui/battle-config/AISettings';
import CharacterList from 'ui/character-creation/CharacterList';

interface IBattleConfigUIProps {
	readonly config?: BattleConfig;
	readonly parties: IPartyData[];
	readonly characters: ICharacterData[];
	readonly onStart: (config: BattleConfig) => void;
	readonly onBack: (e: SyntheticEvent<HTMLButtonElement>) => void;
}

@observer
class BattleConfigUI extends React.Component<IBattleConfigUIProps> {
	private form: BattleConfiguration;

	constructor(props: IBattleConfigUIProps) {
		super(props);

		const { config, parties } = this.props;
		this.form = new BattleConfiguration(config, parties);
	}

	public render(): React.ReactNode {
		const { config, validation } = this.form.state;
		const { parties, characters } = this.props;

		return (
			<Form onSubmit={this.onSubmit}>
				{config.players.map(player => {
					const pid = player.id;
					const chars = this.form.getPartyCharacters(player, characters);
					const errors = validation.errors.players[pid];

					const fieldName = `f-player-${pid}-name`;
					const fieldParty = `f-player-${pid}-party`;
					const fieldControl = `f-player-${pid}-control`;

					return (
						<React.Fragment key={pid}>
							<h2 className="Heading">Player {pid + 1}</h2>

							<FormField fieldId={fieldName} label="Name" error={errors.name}>
								<FormInput
									id={fieldName}
									value={player.name}
									name={fieldName}
									maxLength={playerMaxNameLength}
									isInvalid={!!errors.name}
									onChange={this.onChange(pid, 'name')}
								/>
							</FormField>

							<FormField fieldId={fieldControl} label="Control">
								<FormSelect
									id={fieldControl}
									name={fieldControl}
									value={player.control}
									onChange={this.onChange(pid, 'control')}
								>
									{PlayerControl.map((id, control) => (
										<FormSelectItem text={control.title} value={id} key={id} />
									))}
								</FormSelect>
							</FormField>

							{'AI' === player.control && (
								<AISettingsUI settings={player.aiSettings} onChange={this.onAIChange(pid)} />
							)}

							<FormField fieldId={fieldParty} label="Party">
								<FormSelect
									id={fieldParty}
									name={fieldParty}
									value={player.party}
									onChange={this.onChange(pid, 'party')}
								>
									{parties.map(party => (
										<FormSelectItem text={party.name} value={party.id} key={party.id} />
									))}

									<FormSelectItem text="Random characters" value={randomPartyID} />
								</FormSelect>
							</FormField>

							<CharacterList characters={chars} />
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

	private onChange = (player: number, name: IPlayerDataEditable) => (e: SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => {
		this.form.onPlayerChange(name, player, e.currentTarget.value);
	}

	private onAIChange = (player: number) => (ai: IAISettings) => {
		this.form.onPlayerAIChange(player, ai);
	}

	private onSubmit = (e: SyntheticEvent<HTMLFormElement>): void => {
		e.preventDefault();
		this.form.onSubmit(this.props.onStart);
	}
}

export default BattleConfigUI;
