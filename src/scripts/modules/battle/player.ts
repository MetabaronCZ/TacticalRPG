import { characterCTLimit } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { DirectionID } from 'modules/geometry/direction';
import { IPlayerData } from 'modules/battle-configuration/player-data';
import { ICharacterData } from 'modules/character-creation/character-data';

export interface IPlayerSnapshot {
	readonly data: IPlayerData;
	readonly id: number;
	readonly name: string;
	readonly characters: string[];
}

export interface IPlayerCharacterSetup {
	readonly data: ICharacterData;
	readonly position: Tile;
	readonly direction: DirectionID;
}

class Player {
	public readonly id: number;
	public readonly name: string;
	public readonly data: IPlayerData;
	protected readonly characters: Character[];

	constructor(player: IPlayerData, characters: IPlayerCharacterSetup[]) {
		this.data = player;
		this.id = player.id;
		this.name = player.name;

		this.characters = characters.map(setup => {
			const { data, position, direction } = setup;
			const char = new Character(data, position, direction, this);

			// set small random initial CP
			const ct = Math.floor((characterCTLimit / 10) * Math.random());
			char.attributes.set('CT', ct);

			return char;
		});
	}

	public static from(pl: IPlayerSnapshot): Player {
		return new Player(pl.data, []);
	}

	public serialize(): IPlayerSnapshot {
		return {
			data: { ...this.data },
			id: this.id,
			name: this.name,
			characters: this.characters.map(char => char.battleId)
		};
	}

	public getCharacters(): Character[] {
		return [...this.characters];
	}
}

export default Player;
