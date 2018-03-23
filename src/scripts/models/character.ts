import { Weapons } from 'models/weapon';
import { PlayerType } from 'models/player';
import { IPosition } from 'models/position';
import { ICharacterData } from 'models/character-data';
import { IAttributes, Attributes } from 'models/attributes';

import { WeaponSKillID } from 'models/skill/weapon/id';
import { WeaponSKills } from 'models/skill/weapon';
import { JobSKillID } from 'models/skill/job/id';
import { JobSKills } from 'models/skill/job';
import { Skillsets } from 'models/skillset';
import { SKillType } from './skill';

export enum CharacterActionID {
	MOVE = 'MOVE',
	ATTACK = 'ATTACK',
	WEAPON = 'WEAPON',
	JOB = 'JOB',
	PASS = 'PASS'
}

export interface ICharacterActionItem {
	readonly id: CharacterActionID;
	readonly title: string;
	readonly skills: WeaponSKillID[] | JobSKillID[];
}

export type ICharacterActions = ICharacterActionItem[];

export interface ICharacter {
	readonly data: ICharacterData;
	readonly player: PlayerType;
	readonly position: IPosition;
	readonly baseAttributes: IAttributes;
	readonly currAttributes: IAttributes;
}

export class Character {
	// maximum point of CP of every character
	public static cpLimit = 100;

	public static create(data: ICharacterData, position: IPosition, player: PlayerType): ICharacter {
		const baseAttrs = Attributes.create(data.primary, data.secondary);
		const currAttrs = Attributes.create(data.primary, data.secondary);

		// set small random initial CP
		currAttrs.CP = Math.floor((Character.cpLimit / 10) * Math.random());

		return {
			data,
			player,
			position,
			baseAttributes: baseAttrs,
			currAttributes: currAttrs
		};
	}

	public static tick(char: ICharacter): ICharacter {
		const updated = JSON.parse(JSON.stringify(char)) as ICharacter;
		updated.currAttributes.CP += updated.currAttributes.SPD;
		return updated;
	}

	public static getActions(char: ICharacter): ICharacterActions {
		const main = Weapons.get(char.data.main);
		const off = Weapons.get(char.data.off);
		const skillset = Skillsets.get(char.data.skillset);
		const attackActionSkills = WeaponSKills.filterAttack(main, off);

		const moveAction: ICharacterActionItem = {
			id: CharacterActionID.MOVE,
			title: `Move (${char.currAttributes.MOV} squares)`,
			skills: []
		};

		const attackAction: ICharacterActionItem = {
			id: CharacterActionID.ATTACK,
			title: `Attack (${attackActionSkills.map(([id, wpn]) => wpn.title).join(' + ')})`,
			skills: attackActionSkills.map(([id, wpn]) => id)
		};

		const passAction: ICharacterActionItem = {
			id: CharacterActionID.PASS,
			title: 'End turn',
			skills: []
		};

		const weaponActions: ICharacterActionItem[] = WeaponSKills.filterSpecial(main, off)
			.map(([id, wpn]) => {
				const skill = WeaponSKills.get(id);

				return {
					id: CharacterActionID.WEAPON,
					title: `${skill.title} (${wpn.title})`,
					skills: [id]
				};
			});

		const jobActions: ICharacterActionItem[] = skillset.skills
			.map(id => ({ id, skill: JobSKills.get(id) }))
			.filter(({ skill }) => SKillType.ACTIVE === skill.type)
			.map(({ id, skill }) => ({
					id: CharacterActionID.JOB,
					title: `${skill.title} (${char.data.job})`,
					skills: [id]
			}));

		return [
			moveAction,
			attackAction,
			...weaponActions,
			...jobActions,
			passAction
		];
	}
}
