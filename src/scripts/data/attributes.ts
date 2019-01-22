import { IAttributes } from 'modules/character/attributes';
import { ArchetypeID } from 'modules/character/archetype';
import Character from 'modules/character';

type IArch2AttrTable = {
	readonly [id in ArchetypeID]: {
		readonly P: number;
		readonly S: number;
		readonly M: number;
	};
};

export const Arch2AttTable: IArch2AttrTable = {
	PP: { P: 2, S: 0, M: 0 },
	PS: { P: 1, S: 1, M: 0 },
	PM: { P: 1, S: 0, M: 1 },
	SS: { P: 0, S: 2, M: 0 },
	SM: { P: 0, S: 1, M: 1 },
	MM: { P: 0, S: 0, M: 2 }
};

export const getAttributes = (character: Character): IAttributes => {
	const { archetype, armor } = character;
	const { P, S, M } = Arch2AttTable[archetype.id];
	const phy = 1 + P;
	const mag = (M ? 1 + M : 0);
	const spd = 4 + S;

	return {
		STR: phy,
		VIT: phy,
		SPD: spd,
		MOV: spd,
		MAG: mag,
		SPR: mag,
		HP: 100,
		AP: 8 + 4 * S,
		CT: 0,
		ARM: 50 * P + armor.physical,
		ESH: 50 * M + armor.magical
	};
};
