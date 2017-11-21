import { getRandomParty } from 'utils/party';
import Player from 'engine/player';

const orderMaxLength = 20;
const cpLimit = 100;

class Engine {
	constructor({ party, size }){
		// filter out non-existent characters
		let ally = party.characters.filter(char => char);

		// assign party character positions
		ally.forEach((char, i) => {
			char.position = [i + 2, 0];
		});

		this._ally = new Player(ally, false);

		// create random enemy party
		let enemy = getRandomParty(party.characters.length).characters;

		// assign enemy character positions
		enemy.forEach((char, i) => {
			char.position = [i + 2, size - 1];
		});

		this._enemy = new Player(enemy, true);

		// which player is attacking
		this._initiative = Math.random() < 0.5 ? this._ally : this._enemy;
	}

	getParty(){
		return this._ally.getCharacters();
	}

	getOrder(){
		let ally = this._ally.getCharacters();
		let enemy = this._enemy.getCharacters();
		let characters = ally.concat(enemy);
		let order = [];

		// serialize characters
		characters = characters.map(char => ({
			id: char.id,
			player: char.getPlayer(),
			...char.getAttributes().current
		}));

		while ( order.length < orderMaxLength ){
			let act = [];

			// get characters who can act
			for ( let char of characters ){
				if ( char.CP >= cpLimit ){
					act.push(char.id);
					char.CP %= cpLimit;
				}
				char.CP += char.SPD;
			}

			// sort by character player initiative
			act = act.sort((a, b) => {
				let initPlayer = this._initiative;
				return (initPlayer === b.player) - (initPlayer === a.player);
			});

			// sort by SPD
			act = act.sort((a, b) => b.SPD - a.SPD);

			// add acting characters to order array
			order = order.concat(act);
		}

		// convert character IDs to characters
		characters = ally.concat(enemy);
		order = order.map(id => characters.filter(char => id === char.id)[0]);

		return order;
	}
}

export default Engine;
