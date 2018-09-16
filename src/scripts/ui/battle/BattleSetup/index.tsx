import React, { SyntheticEvent } from 'react';

import { validateField } from 'utils/validation';
import { playerMaxNameLength, maxPlayers, randomPartyID } from 'data/game-config';

import Form from 'ui/common/Form';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import FormField from 'ui/common/FormField';
import FormInput from 'ui/common/FormInput';
import FormSelect from 'ui/common/FormSelect';
import FormSelectItem from 'ui/common/FormSelectItem';
import CharacterList from 'ui/character-creation/CharacterList';

import { ICharacterData } from 'modules/character-data/types';

import PlayerControl from 'engine/player-control';
import PartyUtils, { IPartyData } from 'engine/party-data';
import { IBattleConfig, IBattleConfigPlayer } from 'engine/battle-config';

// empty array to map player data / states
const playerPool = Array(maxPlayers).fill(0);

interface IBattleSetupProps {
	readonly config: IBattleConfig;
	readonly parties: IPartyData[];
	readonly characters: ICharacterData[];
	readonly onStart: (config: IBattleConfig) => void;
	readonly onBack: (e: SyntheticEvent<any>) => void;
}

type IBattleSetupPlayerError = Partial<Record<keyof IBattleConfigPlayer, string|undefined>>;

interface IBattleSetupState {
	readonly fields: IBattleConfig;
	readonly errors: {
		players: IBattleSetupPlayerError[];
	};
}

class BattleSetup extends React.Component<IBattleSetupProps, IBattleSetupState> {
	constructor(props: IBattleSetupProps) {
		super(props);

		const { config, parties } = this.props;
		const defaultParty = parties.length ? parties[0].id : randomPartyID;
		const partyIDs = [...parties.map(({ id }) => id), randomPartyID];

		this.state = {
			fields: {
				players: playerPool.map((_, p) => {
					const conf = config.players[p];
					let party = defaultParty;

					if (conf && -1 !== partyIDs.indexOf(conf.party)) {
						party = conf.party;
					}
					return {
						name: (conf ? conf.name : `Player ${p + 1}`),
						control: (conf ? conf.control : 'HUMAN'),
						party
					};
				})
			},
			errors: {
				players: playerPool.map(() => ({}))
			}
		};
	}

	public render() {
		const { characters, parties } = this.props;
		const players = this.state.fields.players;
		const errors = this.state.errors.players;
		let isValidSelection = true;

		// validate errors
		main: for (const err of errors) {
			for (const e in err) {
				if ((err as any)[e]) {
					isValidSelection = false;
					break main;
				}
			}
		}

		return (
			<Form onSubmit={this.onSubmit}>
				{playerPool.map((_, p) => {
					const selectedParty = parties.filter(party => party.id === players[p].party)[0];
					let chars: ICharacterData[] = [];

					if (selectedParty) {
						chars = selectedParty.characters
							.map(id => PartyUtils.getCharacterById(id, characters))
							.filter(char => !!char);
					}
					const partyValidation = PartyUtils.validate(chars);
					const isValidParty = (randomPartyID === players[p].party || (true === partyValidation && chars.length));

					if (!isValidParty) {
						isValidSelection = false;
					}
					const onChange = (name: string) => (e: SyntheticEvent) => this.onChange(e, name, p);

					return (
						<React.Fragment key={p}>
							<h2 className="Heading">Player {p + 1}</h2>

							<FormField fieldId={`f-player-${p}-name`} label="Name" error={errors[p].name}>
								<FormInput
									id={`f-player-${p}-name`}
									type="text"
									value={players[p].name}
									name={`player-${p}-name`}
									maxLength={playerMaxNameLength}
									isInvalid={!!errors[p].name}
									onChange={onChange('name')}
								/>
							</FormField>

							<FormField fieldId={`f-player-${p}-control`} label="Control">
								<FormSelect id={`f-player-${p}-control`} name={`player-${p}-control`} value={players[p].control} onChange={onChange('control')}>
									{PlayerControl.map((id, control, i) => (
										<FormSelectItem value={id} key={i}>
											{control.title}
										</FormSelectItem>
									))}
								</FormSelect>
							</FormField>

							<FormField fieldId={`f-player-${p}-party`} label="Party">
								<FormSelect id={`f-player-${p}-party`} name={`f-player-${p}-party`} value={players[p].party} onChange={onChange('party')}>
									{parties && parties.map((party, i) => (
										<FormSelectItem value={party.id} key={i}>
											{party.name}
										</FormSelectItem>
									))}

									<FormSelectItem value={randomPartyID}>
										Random characters
									</FormSelectItem>
								</FormSelect>
							</FormField>

							{chars.length > 0 && (
								isValidParty
									? <CharacterList characters={chars} />
									: <p className="ErrorBox">Invalid Party: {partyValidation}</p>
							)}

							<br />
							<Separator />
						</React.Fragment>
					);
				})}

				<ButtonRow>
					<Button ico="back" text="Back" onClick={this.props.onBack} />
					{isValidSelection && <Button ico="fight" text="Start" color="green" type="submit" />}
				</ButtonRow>
			</Form>
		);
	}

	private onChange = (e: SyntheticEvent<any>, name: string, player: number) => {
		const value = e.currentTarget.value;
		validateField(name, value, (field, error) => this.handleValidationError(field, error, player));

		this.setState(state => ({
			fields: {
				...state.fields,
				players: state.fields.players.map((item, i) => {
					if (player === i) {
						return Object.assign({}, item, { [name]: value });
					}
					return item;
				})
			}
		}));
	}

	private handleValidationError = (field: string, error: string|null, player: number) => {
		this.setState(state => ({
			errors: {
				...state.errors,
				players: state.errors.players.map((item, i) => {
					if (player === i) {
						return Object.assign({}, item, { [field]: error || undefined });
					}
					return item;
				})
			}
		}));
	}

	private onSubmit = (e: SyntheticEvent<any>) => {
		e.preventDefault();

		if (this.props.onStart) {
			this.props.onStart(this.state.fields);
		}
	}
}

export default BattleSetup;
