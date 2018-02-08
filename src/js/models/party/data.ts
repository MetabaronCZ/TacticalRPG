import { IIndexable } from 'utils/array';

export default interface IPartyData extends IIndexable {
	name: string;
	characters: string[];
}
