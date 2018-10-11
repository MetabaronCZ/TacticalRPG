import Logger from 'engine/logger';
import IndexableList from 'engine/indexable-list';
import { IPartyData, PartyData } from 'engine/party-creation/party-data';
import { IBattleConfig, BattleConfig } from 'engine/battle-configuration/battle-config';
import { ICharacterData, CharacterData } from 'engine/character-creation/character-data';
import { randomPartyID } from 'data/game-config';

const KEY = 'game'; // storage key

interface ISaveState {
	readonly battleConfig: IBattleConfig;
	readonly characters: ICharacterData[];
	readonly parties: IPartyData[];
}

export class Store {
	public characters = new IndexableList<CharacterData>();
	public parties = new IndexableList<PartyData>();
	public battleConfig = new BattleConfig();

	constructor() {
		this.initialize();
	}

	public save() {
		localStorage.setItem(KEY, JSON.stringify({
			battleConfig: this.battleConfig.serialize(),
			characters: this.characters.serialize(),
			parties: this.parties.serialize()
		}));
	}

	private initialize() {
		const saved = localStorage.getItem(KEY) || '';

		if (!saved) {
			return;
		}

		try {
			const data = JSON.parse(saved) as ISaveState;

			this.battleConfig = this.prepareBattleConfig(data.battleConfig, data.parties);
			this.characters = this.prepareCharacters(data.characters);
			this.parties = this.prepareParties(data.parties, this.characters.data);

		} catch (err) {
			Logger.error(`Invalid store data: "${err}"`);
		}
	}

	private prepareBattleConfig(data?: IBattleConfig, parties: IPartyData[] = []): BattleConfig {
		const config = new BattleConfig(data, parties);

		for (const player of config.players) {
			// fix invalid player party preference
			if (!player.isValidParty(player.party)) {
				player.setParty(randomPartyID);
			}
		}
		return config;
	}

	private prepareCharacters(data: ICharacterData[] = []): IndexableList<CharacterData> {
		const characters: CharacterData[] = [];

		for (const char of data) {
			if (!char) {
				continue;
			}
			const charData = new CharacterData(char);
			const validation = charData.validate();

			if (validation.isValid) {
				characters.push(charData);
			} else {
				Logger.error(`Invalid character: "${JSON.stringify(validation.errors)}"`);
			}
		}
		return new IndexableList(characters);
	}

	private prepareParties(data: IPartyData[] = [], characters: CharacterData[] = []): IndexableList<PartyData> {
		const parties: PartyData[] = [];

		for (const party of data) {
			if (!party) {
				continue;
			}
			const partyData = new PartyData(party, characters);
			const validation = partyData.validate();

			if (validation.isValid) {
				parties.push(partyData);
			} else {
				Logger.error(`Invalid party: "${JSON.stringify(validation.errors)}"`);
			}
		}
		return new IndexableList(parties);
	}
}
