import uuid from 'uuid/v1';
import Position from 'engine/position';
import { getAttributes } from 'utils/character/attributes';

class Character {
	constructor(conf, player){
		this.id = conf.id || uuid();
		this._conf = conf;
		this._player = player;
		this._position = new Position(...conf.position);

		this._baseAttrs = getAttributes(conf.primary, conf.secondary);
		this._currAttrs = getAttributes(conf.primary, conf.secondary);

		// set small random initial CP
		this._currAttrs.CP = Math.floor(10*Math.random());

		/* */Object.assign(this, conf);
	}

	getAttributes(){
		return {
			base: this._baseAttrs,
			current: this._currAttrs
		};
	}

	getPlayer(){
		return this._player;
	}

	getPosition(){
		return this._position;
	}
}

export default Character;
