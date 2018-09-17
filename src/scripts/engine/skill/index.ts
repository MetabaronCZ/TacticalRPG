import Skills from 'data/skills';

import { StatusEffectID } from 'engine/status-effect';
import { SkillID, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'engine/skill/skill-data';

class Skill {
	public readonly id: SkillID;
	public readonly title: string;
	public readonly cost: number; // AP cost
	public readonly type: SkillType;
	public readonly range: SkillRange;
	public readonly area: SkillArea;
	public readonly target: SkillTarget; // character target type
	public readonly element: SkillElement; // fire, water, ...
	public readonly isFixedPhysicalDamage: boolean;
	public readonly physicalDamage: number; // damage modifier [%]
	public readonly elementalDamage: number; // elemental damage modifier [%]
	public readonly status: StatusEffectID[]; // status effects added to attack

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
		this.isFixedPhysicalDamage = data.isFixedPhysicalDamage || false;
		this.physicalDamage = data.physicalDamage || 0;
		this.elementalDamage = data.elementalDamage || 0;
		this.status = data.status || [];
	}
}

export default Skill;
