import React from 'react';

import Skillsets from 'data/skillsets';
import { Icos, IcoID } from 'data/icos';

import { ICombatResult } from 'modules/battle/act/combat-phase';
import { ICharacterData, isDualWielding } from 'modules/character-creation/character-data';

import ArmorIco from 'ui/common/ArmorIco';
import WeaponIco from 'ui/common/WeaponIco';
import ElementIco from 'ui/common/ElementIco';
import ArchetypeIco from 'ui/common/ArchetypeIco';

export const formatCharacter = (character: ICharacterData | null): React.ReactNode => {
	if (!character) {
		return '';
	}
	const { sex, archetype, skillset, main, off, armor } = character;
	const element = Skillsets.get(skillset).element;

	let offA: React.ReactNode = '';

	if (isDualWielding(character)) {
		offA = <WeaponIco weapon={main} minimal />;
	} else {
		offA = <WeaponIco weapon={off} minimal />;
	}
	return (
		<React.Fragment>
			{Icos[sex.toLowerCase() as IcoID] || ''}
			{' '}
			<ArchetypeIco archetype={archetype} />
			{' '}
			{'NONE' !== element && (
				<ElementIco element={element} minimal />
			)}
			{' '}
			<WeaponIco weapon={main} minimal />
			{' '}
			{offA}
			{' '}
			<ArmorIco armor={armor} minimal />
		</React.Fragment>
	);
};

export const formatCombatResult = (result: ICombatResult): React.ReactNode => {
	let txt = '-';

	if (result.isSupport) {
		txt = 'Healed';
	}

	if (result.evaded) {
		txt = 'Evaded';
	}
	if (result.damaged > 0) {
		txt = result.damaged + ' damage';
	}
	if (result.healed > 0) {
		txt = result.healed + ' healing';
	}
	if (result.revived) {
		txt = 'Revived';
	}
	if (result.killed) {
		txt = `Killed (${result.damaged} damage)`;
	}
	return txt;
};

