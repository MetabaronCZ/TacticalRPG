import Character from 'modules/character';
import { meleeWeapons } from 'modules/equipment/weapon-data';

export type CharacterRoleID = 'MELEE' | 'RANGER' | 'MAGE' | 'HEALER';

class CharacterRole {
	private readonly roles: CharacterRoleID[];

	constructor(character: Character) {
		this.roles = this.getRoles(character);
	}

	public get length(): number {
		return this.roles.length;
	}

	public has(role: CharacterRoleID): boolean {
		return -1 !== this.roles.indexOf(role);
	}

	public get(): CharacterRoleID[] {
		return [...this.roles];
	}

	private getRoles = (char: Character): CharacterRoleID[] => {
		const { archetype, mainHand: main, offHand: off } = char;

		const hasHealing = !!char.skillset.skills.find(skill => !!skill.healing);
		const hasRangedWpn = ('RANGED' === main.type || 'RANGED' === off.type);
		const hasMagicalWpn = ('MAGICAL' === main.type || 'MAGICAL' === off.type);

		const hasMeleeWpn = (
			meleeWeapons.includes(main.type) ||
			meleeWeapons.includes(off.type)
		);
		const roles: CharacterRoleID[] = [];

		const setMeleeRole = (): void => {
			if (hasMeleeWpn) {
				roles.push('MELEE');
			}
		};

		const setRangerRole = (): void => {
			if (hasRangedWpn) {
				roles.push('RANGER');
			}
		};

		const setMageRole = (): void => {
			if (hasHealing) {
				roles.push('HEALER');
			} else {
				roles.push('MAGE');
			}
		};

		switch (archetype.id) {
			case 'PP':
				setMeleeRole();
				break;

			case 'PS':
				setMeleeRole();
				setRangerRole();
				break;

			case 'PM':
				if (hasMagicalWpn) {
					setMageRole();
					setMeleeRole();
				} else {
					setMeleeRole();
					setMageRole();
				}
				break;

			case 'SS':
				setRangerRole();
				setMeleeRole();
				break;

			case 'SM':
				if (hasMagicalWpn) {
					setMageRole();
					setRangerRole();
					setMeleeRole();
				} else {
					setRangerRole();
					setMeleeRole();
					setMageRole();
				}
				break;

			case 'MM':
				setMageRole();
				break;

			default:
				throw new Error('Invalid archetype ID: ' + archetype.id);
		}

		if (0 === roles.length) {
			throw new Error('Could not assign character role: invalid character');
		}
		return roles;
	}
}

export default CharacterRole;
