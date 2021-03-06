import { randomPartyID, gameStorageKey } from 'data/game-config';

import Logger from 'modules/logger';
import IndexableList from 'modules/indexable-list';
import { IPartyData, PartyData } from 'modules/party-creation/party-data';
import { IBattleConfig, BattleConfig } from 'modules/battle-configuration/battle-config';
import { ICharacterData, CharacterData } from 'modules/character-creation/character-data';

interface ISaveState {
	readonly battleConfig: IBattleConfig;
	readonly characters: ICharacterData[];
	readonly parties: IPartyData[];
}

export class Store {
	public characters = new IndexableList<ICharacterData>();
	public parties = new IndexableList<IPartyData>();
	public battleConfig = new BattleConfig(null);

	constructor() {
		const saved = localStorage.getItem(gameStorageKey) || '';

		if (!saved) {
			return;
		}

		try {
			const { battleConfig, characters, parties } = JSON.parse(saved) as ISaveState;
			this.battleConfig = this.prepareBattleConfig(battleConfig, parties);
			this.characters = this.prepareCharacters(characters);
			this.parties = this.prepareParties(parties, characters);

		} catch (err) {
			Logger.error(`Invalid store data: "${err}"`);
		}
	}

	public save(): void {
		localStorage.setItem(gameStorageKey, JSON.stringify({
			battleConfig: this.battleConfig.serialize(),
			characters: this.characters.serialize(),
			parties: this.parties.serialize()
		}));
	}

	private prepareBattleConfig(data?: IBattleConfig, parties: IPartyData[] = []): BattleConfig {
		const config = new BattleConfig(data || null);

		for (const player of config.players) {
			// fix invalid player party preference
			if (!player.isValidParty(player.party, parties)) {
				player.setParty(randomPartyID);
			}
		}
		return config;
	}

	private prepareCharacters(data: ICharacterData[] = []): IndexableList<ICharacterData> {
		const characters: ICharacterData[] = [];

		for (const char of data) {
			if (!char) {
				continue;
			}
			const charData = new CharacterData(char);
			const validation = charData.validate();

			if (validation.isValid) {
				characters.push(char);
			} else {
				Logger.error(`Invalid character: "${JSON.stringify(validation.errors)}"`);
			}
		}
		return new IndexableList(characters);
	}

	private prepareParties(data: IPartyData[] = [], characters: ICharacterData[] = []): IndexableList<IPartyData> {
		const parties: IPartyData[] = [];

		for (const party of data) {
			if (!party) {
				continue;
			}
			const partyData = new PartyData(party, characters);
			const validation = partyData.validate();

			if (validation.isValid) {
				parties.push(party);
			} else {
				Logger.error(`Invalid party: "${JSON.stringify(validation.errors)}"`);
			}
		}
		return new IndexableList(parties);
	}
}
