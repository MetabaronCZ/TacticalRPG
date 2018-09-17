import Skills from 'data/skills';

import { StatusEffectID } from 'engine/status-effect';
import { SkillID, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'engine/skill/skill-data';

class Skill {
	private readonly id: SkillID;
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

	constructor(id: SkillID) {
		const data = Skills.get(id);
		this.id = id;
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

	public isType(type: SkillType): boolean {
		return type === this.type;
	}

	public isTarget(id: SkillTarget): boolean {
		return id === this.target;
	}

	public isArea(id: SkillArea): boolean {
		return id === this.area;
	}

	public getId(): SkillID {
		return this.id;
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
