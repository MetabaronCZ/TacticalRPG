import nameSamples from 'data/names';
import { gridSize, maxPartyNameLength, randomPartyID, maxPartySize } from 'data/game-config';

import RandomNameGenerator from 'core/random-name-generator';

import Order from 'modules/order';
import Party from 'modules/party';
import Player from 'modules/player';
import Position from 'modules/position';
import Character from 'modules/character';

import { ActPhase, GamePhase, IGameState } from 'modules/game/types';
import { ICharacterData } from 'modules/character-data/types';
import CharacterData from 'modules/character-data';
import { PlayerType } from 'modules/player/types';
import { IParty } from 'modules/party/types';
import { IPosition } from 'modules/position/types';

import { DirectionID } from 'engine/direction';
import { IBattleConfigPlayer } from 'engine/battle-config';

const getInitialState = (players: IBattleConfigPlayer[], characters: ICharacterData[], parties: IParty[], initiative: PlayerType): IGameState => {
	const ally = Player.create(PlayerType.ALLY);
	const enemy = Player.create(PlayerType.ENEMY);

	const pls = players.map((data, i) => {
		let charData: ICharacterData[];

		if (randomPartyID === data.party) {
			// create random characters
			const names = RandomNameGenerator.get(nameSamples, maxPartySize, maxPartyNameLength);
			charData = names.map(name => CharacterData.random(name));

		} else {
			// user created characters
			const party = parties.find(p => data.party === p.id);

			if (!party) {
				throw new Error('Could not create player charaters: Invalid party');
			}
			charData = party.characters.filter(id => !!id).map(id => Party.getCharacterById(id, characters));
		}

		return charData.map((char, c) => {
			let pos: IPosition;
			let dir: DirectionID;
			let type: PlayerType;

			if (1 === i) {
				pos = Position.create(c + 2, 0);
				dir = 'BOTTOM';
				type = PlayerType.ENEMY;
			} else {
				pos = Position.create(c + 2, gridSize - 1);
				dir = 'TOP';
				type = PlayerType.ALLY;
			}

			return Character.create(char, pos, dir, type);
		});
	});

	const allies = pls[0];
	const enemies = pls[1];

	const chars = allies.concat(enemies);
	const order = Order.get(chars, initiative);

	return {
		phase: GamePhase.IDLE,
		tick: 0,
		actors: [],
		ally,
		enemy,
		characters: chars,
		order,
		act: {
			phase: ActPhase.MOVE
		},
		move: {},
		skill: {},
		react: {},
		direct: {},
		skillInfo: []
	};
};

const Game = {
	getInitialState
};

export default Game;
