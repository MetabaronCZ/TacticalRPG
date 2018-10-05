import Logger from 'engine/logger';
import ObservableList from 'engine/observable-list';
import { IPartyData, PartyData } from 'engine/party-data';
import { IBattleConfig, BattleConfig } from 'engine/battle-config';
import { ICharacterData, CharacterData } from 'engine/character-data';

const KEY = 'game'; // storage key

interface ISaveState {
	readonly battleConfig: IBattleConfig;
	readonly characters: ICharacterData[];
	readonly parties: IPartyData[];
}

export class Store {
	public characters = new ObservableList<CharacterData>();
	public parties = new ObservableList<PartyData>();
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

			this.battleConfig = this.prepareBattleConfig(data.battleConfig);
			this.characters = this.prepareCharacters(data.characters);
			this.parties = this.prepareParties(data.parties, this.characters.data);

		} catch (err) {
			Logger.error(`Invalid store data: "${err}"`);
		}
	}

	private prepareBattleConfig(data: IBattleConfig): BattleConfig {
		return new BattleConfig(data);
	}

	private prepareCharacters(data: ICharacterData[] = []): ObservableList<CharacterData> {
		const characters: CharacterData[] = [];

		for (const char of data) {
			if (!char) {
				continue;
			}
			const charData = new CharacterData(char);

			if (charData.isValid()) {
				characters.push(charData);
			} else {
				Logger.error(`Invalid character: "${JSON.stringify(charData.serialize())}"`);
			}
		}
		return new ObservableList(characters);
	}

	private prepareParties(data: IPartyData[] = [], characters: CharacterData[] = []): ObservableList<PartyData> {
		const parties: PartyData[] = [];

		for (const party of data) {
			if (!party) {
				continue;
			}
			const partyData = new PartyData(party, characters);

			if (partyData.isValid()) {
				parties.push(partyData);
			} else {
				Logger.error(`Invalid party: "${JSON.stringify(partyData.serialize())}"`);
			}
		}
		return new ObservableList(parties);
	}
}
