import { ArchetypeID } from 'modules/character/archetype';
import { AttributeID } from 'modules/character/attributes';

type IArch2AttrTable = {
	readonly [id in ArchetypeID]: {
		readonly P: number;
		readonly S: number;
		readonly M: number;
	};
};

type AttributeFormula = (P: number, S: number, M: number) => number;

type IAttributeFormulas = {
	readonly [attr in AttributeID]: AttributeFormula;
};

export const Arch2AttTable: IArch2AttrTable = {
	PP: { P: 2, S: 0, M: 0 },
	PS: { P: 1, S: 1, M: 0 },
	PM: { P: 1, S: 0, M: 1 },
	SS: { P: 0, S: 2, M: 0 },
	SM: { P: 0, S: 1, M: 1 },
	MM: { P: 0, S: 0, M: 2 }
};

export const attributeFormulas: IAttributeFormulas = {
	STR: (P, S, M) => 10 + P * 10,
	VIT: (P, S, M) => 10 + P * 10,
	SPD: (P, S, M) => 4 + S,
	MOV: (P, S, M) => 4 + S,
	MAG: (P, S, M) => 10 + M * 10,
	SPR: (P, S, M) => 10 + M * 10,
	HP:  (P, S, M) => 100 + P * 50,
	MP:  (P, S, M) => M * 50,
	AP:  (P, S, M) => 8 + 4 * S,
	CT:  (P, S, M) => 0
};
