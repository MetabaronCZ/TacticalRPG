import { combineReducers } from 'redux';

import parties from 'reducers/app/parties';
import characters from 'reducers/app/characters';

import { IParty } from 'models/party';
import { ICharacterData } from 'models/character-data';

export interface IAppState {
	readonly characters: ICharacterData[];
	readonly parties: IParty[];
}

export const defaultAppState: IAppState = {
	characters: [],
	parties: []
};

export default combineReducers<IAppState>({
	characters,
	parties
});
