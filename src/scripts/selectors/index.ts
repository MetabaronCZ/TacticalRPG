import { createSelector } from 'reselect';
import { IStore } from 'store';

const stateToCharacters = (state: IStore) => state.characters;
const stateToParties = (state: IStore) => state.parties;

export const getCharacters = createSelector([stateToCharacters], characters => characters);
export const getParties = createSelector([stateToParties], parties => parties);
