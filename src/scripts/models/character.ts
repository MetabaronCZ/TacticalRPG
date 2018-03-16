import { Weapons } from 'models/weapon';
import { PlayerType } from 'models/player';
import { IPosition } from 'models/position';
import { SkillUsage, SKillType } from 'models/skill';
import { ICharacterData } from 'models/character-data';
import { IAttributes, Attributes } from 'models/attributes';
import { WeaponSKills, WeaponSKillID } from 'models/skill/weapons';

export enum CharacterActionID {
	ATTACK = 'ATTACK',
	WEAPON = 'WEAPON',
	JOB = 'JOB',
	PASS = 'PASS'
}

export interface ICharacterActionItem {
	readonly id: CharacterActionID;
	readonly title: string;
	readonly skills: WeaponSKillID[];
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

		const attackAction: ICharacterActionItem = {
			id: CharacterActionID.ATTACK,
			title: `Attack (${main.title + ('NONE' !== char.data.off ? ' + ' + off.title : '')})`,
			skills: []
		};

		const passAction: ICharacterActionItem = {
			id: CharacterActionID.PASS,
			title: 'Pass',
			skills: []
		};

		const specialActions: ICharacterActions = [];

		for (const id of main.skills) {
			const skill = WeaponSKills.get(id);

			if (SKillType.ACTIVE !== skill.type) {
				continue;
			}

			if (SkillUsage.ATTACK === skill.usage) {
				attackAction.skills.push(id);

			} else if (SkillUsage.SPECIAL === skill.usage) {
				specialActions.push({
					id: CharacterActionID.WEAPON,
					title: `${skill.title} (${main.title})`,
					skills: [id]
				});
			}
		}

		for (const id of off.skills) {
			const skill = WeaponSKills.get(id);

			if (SKillType.ACTIVE !== skill.type) {
				continue;
			}

			if (SkillUsage.ATTACK === skill.usage) {
				attackAction.skills.push(id);

			} else if (SkillUsage.SPECIAL === skill.usage && char.data.main !== char.data.off) {
				specialActions.push({
					id: CharacterActionID.WEAPON,
					title: `${skill.title} (${off.title})`,
					skills: [id]
				});
			}
		}

		return [
			attackAction,
			...specialActions,
			passAction
		];
	}
}
