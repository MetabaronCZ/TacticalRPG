import Character from 'modules/character';
import { WeaponTypeID } from 'modules/equipment/weapon-data';

const nonMeleeWpns: WeaponTypeID[] = ['NONE', 'MAGICAL', 'RANGED','SHIELD'];

type CharacterRoleID = 'MELEE' | 'RANGER' | 'MAGE' | 'HEALER';
type IterationFn = (role: CharacterRoleID, i: number) => void;

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

	public each(fn: IterationFn): void {
		return this.roles.forEach(fn);
	}

	private getRoles = (char: Character): CharacterRoleID[] => {
		const { archetype, mainHand: main, offHand: off } = char;

		const hasHealing = ('HOLY' === char.skillset.element);
		const hasRangedWpn = ('RANGED' === main.type || 'RANGED' === off.type);
		const hasMagicalWpn = ('MAGICAL' === main.type || 'MAGICAL' === off.type);

		const hasMeleeWpn = (
			-1 === nonMeleeWpns.indexOf(main.type) ||
			-1 === nonMeleeWpns.indexOf(off.type)
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
