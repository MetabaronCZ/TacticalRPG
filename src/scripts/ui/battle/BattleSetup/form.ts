import { observable, action } from 'mobx';

import { validateField } from 'utils/validation';
import { randomPartyID, maxPlayers } from 'data/game-config';

import { PartyData } from 'engine/party-data';
import CharacterList from 'engine/character-list';
import { BattleConfig } from 'engine/battle-config';
import { CharacterData } from 'engine/character-data';
import { PlayerControlID } from 'engine/player-control';
import { PlayerConfig, IPlayerConfig } from 'engine/player-config';

const playerPool = Array(maxPlayers).fill(0);
const editableFields: BattleSetupEditable[] = ['name', 'party', 'control'];

export type BattleSetupEditable = keyof IPlayerConfig;

interface IPlayerBattleSetup {
	name: string;
	party: string;
	control: PlayerControlID;
	parties: PartyData[];
	errors: {
		[field in keyof PlayerConfig]?: string;
	};
}

class BattleSetupForm {
	@observable public state: IPlayerBattleSetup[];

	constructor(config: BattleConfig, parties: PartyData[]) {
		const defaultParty = parties.length ? parties[0].id : randomPartyID;
		const partyIDs = [...parties.map(({ id }) => id), randomPartyID];

		this.state = playerPool.map((_, p) => {
			let conf = config.players[p];

			if (!conf) {
				conf = new PlayerConfig({
					name: `Player ${p + 1}`,
					control: 'HUMAN',
					party: defaultParty
				});
			}
			let party = defaultParty;

			if (-1 !== partyIDs.indexOf(conf.party)) {
				party = conf.party;
			}
			return {
				name: conf.name,
				control: conf.control,
				party,
				parties,
				errors: {}
			};
		});
	}

	@action
	public change(field: BattleSetupEditable, player: number, value: string) {
		const validation = validateField(name, value);

		this.state.map((pl, i) => {
			if (i === player) {
				if (validation.isValid) {
					pl[field] = value;
				}
				pl.errors[field] = validation.error;
			}
			return pl;
		});
	}

	public isValid(): boolean {
		const isValid = true;

		for (const player of this.state) {
			for (const field of editableFields) {
				const validation = validateField(field, player[field]);

				if (!validation.isValid) {
					return false;
				}
			}
		}

		return isValid;
	}

	public getPartyCharacters(player: IPlayerBattleSetup): CharacterList {
		const characters: CharacterData[] = [];

		if (randomPartyID !== player.party) {
			const selecteParty = player.parties.find(party => player.party === party.id);

			if (selecteParty) {
				for (const char of selecteParty.getCharacters()) {
					if (null !== char) {
						characters.push(char);
					}
				}
			}
		}
		return new CharacterList(characters);
	}

	public getConfig(): BattleConfig {
		return new BattleConfig({
			players: this.state.map(pl => new PlayerConfig({
				name: pl.name,
				control: pl.control,
				party: pl.party
			}))
		});
	}
}

export default BattleSetupForm;
