import smallSkills from 'data/skills/weapon/small';
import wield1HSkills from 'data/skills/weapon/wield1h';
import wield2HSkills from 'data/skills/weapon/wield2h';
import rangedSkills from 'data/skills/weapon/ranged';
import shieldSkills from 'data/skills/weapon/shield';

import { ISkillData } from 'modules/skill/skill-data';
import { WeaponSkillID } from 'modules/skill/weapon';

const weaponSkills: { [id in WeaponSkillID]: ISkillData; } = {
	...smallSkills,
	...wield1HSkills,
	...wield2HSkills,
	...rangedSkills,
	...shieldSkills
};

export default weaponSkills;
