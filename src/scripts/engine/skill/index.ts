import { StatusEffectID } from 'engine/status-effect';
import { MagicSkillID } from 'engine/skill/magic/types';
import { WeaponSkillID } from 'engine/skill/weapon/types';
import { ArchetypeSkillID } from 'engine/skill/archetype';

export type SkillID = ArchetypeSkillID | WeaponSkillID | MagicSkillID;

export type SkillType = 'ACTIVE' | 'REACTIVE' | 'PASSIVE';
export type SkillArea = 'SINGLE' | 'LINE' | 'CROSS' | 'AOE3x3' | 'NEIGHBOURS';
export type SkillElement = 'NONE' | 'FIRE' | 'ICE' | 'WIND' | 'EARTH' | 'THUNDER' | 'WATER' | 'DARK' | 'HOLY' | 'PSYCHIC';
export type SkillTarget = 'NONE' | 'ANY' | 'SELF' | 'ALLY' | 'ENEMY';
export enum SkillRange { R0 = 0, R1 = 1, R2 = 2, R4 = 4 }

export interface ISkillData {
	readonly title: string;
	readonly cost: number;
	readonly type: SkillType;
	readonly range: SkillRange;
	readonly area: SkillArea;
	readonly target?: SkillTarget;
	readonly element?: SkillElement;
	readonly isFixedPhysicalDamage?: boolean;
	readonly physicalDamage?: number;
	readonly elementalDamage?: number;
	readonly status?: StatusEffectID[];
}

class Skill {
	private readonly title: string;
	private readonly cost: number; // AP cost
	private readonly type: SkillType;
	private readonly range: SkillRange;
	private readonly area: SkillArea;
	private readonly target: SkillTarget; // character target type
	private readonly element: SkillElement; // fire, water, ...
	private readonly fixedPhysicalDamage: boolean;
	private readonly physicalDamage: number; // damage modifier [%]
	private readonly elementalDamage: number; // elemental damage modifier [%]
	private readonly status: StatusEffectID[]; // status effects added to attack

	constructor(data: ISkillData) {
		this.title = data.title;
		this.cost = data.cost;
		this.type = data.type;
		this.range = data.range;
		this.area = data.area;
		this.target = data.target || 'NONE';
		this.element = data.element || 'NONE';
		this.fixedPhysicalDamage = data.isFixedPhysicalDamage || false;
		this.physicalDamage = data.physicalDamage || 0;
		this.elementalDamage = data.elementalDamage || 0;
		this.status = data.status || [];
	}

	public isFixedPhysicalDamage() {
		return this.fixedPhysicalDamage;
	}

	public isTarget(id: SkillTarget): boolean {
		return id === this.target;
	}

	public isArea(id: SkillArea): boolean {
		return id === this.area;
	}

	public getTitle() {
		return this.title;
	}

	public getCost() {
		return this.cost;
	}

	public getType() {
		return this.type;
	}

	public getRange() {
		return this.range;
	}

	public getArea() {
		return this.area;
	}

	public getTarget() {
		return this.target;
	}

	public getElement() {
		return this.element;
	}

	public getPhysicalDamage() {
		return this.physicalDamage;
	}

	public getElementalDamage() {
		return this.elementalDamage;
	}

	public getStatus() {
		return this.status;
	}
}

export default Skill;
