import Character from 'engine/character';

class Player {
	constructor(characters, isEnemy){
		this._characters = characters.map(char => new Character(char, this));
		this._isEnemy = !!isEnemy;
	}

	getCharacters(){
		return this._characters;
	}

	isEnemy(){
		return this._isEnemy;
	}
}

export default Player;
