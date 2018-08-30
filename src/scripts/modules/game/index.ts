import { gridSize, enemyPlayerName, allyPlayerName } from 'data/game-config';

import Order from 'modules/order';
import Party from 'modules/party';
import Player from 'modules/player';
import Position from 'modules/position';
import Character from 'modules/character';

import { ActPhase, GamePhase, IGameState } from 'modules/game/types';
import { ICharacterData } from 'modules/character-data/types';
import { PlayerType } from 'modules/player/types';
import { Direction } from 'modules/direction';

const getInitialState = (charIds: string[], chars: ICharacterData[], initiative: PlayerType): IGameState => {
	const party = charIds
		.filter(id => !!id)
		.map(id => Party.getCharacterById(id, chars));

	const ally = Player.create(allyPlayerName, PlayerType.ALLY);
	const enemy = Player.create(enemyPlayerName, PlayerType.ENEMY);

	const allies = party.map((char, i) => {
		return Character.create(char, Position.create(i + 2, gridSize - 1), Direction.TOP, PlayerType.ALLY);
	});

	const enemies = Party.getRandomCharacters(party.length)
		.map((char, i) => {
			return Character.create(char, Position.create(i + 2, 0), Direction.BOTTOM, PlayerType.ENEMY);
		});

	const characters = allies.concat(enemies);
	const order = Order.get(characters, initiative);

	return {
		phase: GamePhase.IDLE,
		tick: 0,
		actors: [],
		ally,
		enemy,
		characters,
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
