import React from 'react';

import { ITargetCombatPreview } from 'modules/battle/combat';

import ElementIco from 'ui/common/ElementIco';
import CombatInfo from 'ui/battle/CombatInfo';

interface IProps {
	preview: ITargetCombatPreview;
}

const TargetInfo: React.SFC<IProps> = ({ preview }) => {
	const {
		statusModifier,
		block, shield,
		physical, magical,
		elementalStrength, elementalWeakness
	} = preview;

	return (
		<React.Fragment>
			{'NONE' !== elementalStrength && (
				<CombatInfo label="Elemental strength">
					<ElementIco element={elementalStrength} />
				</CombatInfo>
			)}

			{'NONE' !== elementalWeakness && (
				<CombatInfo label="Elemental weakness">
					<ElementIco element={elementalWeakness} />
				</CombatInfo>
			)}

			<CombatInfo label="Physical damage reduction">
				{physical * 100}%
			</CombatInfo>

			<CombatInfo label="Magical damage reduction">
				{magical * 100}%
			</CombatInfo>

			{null !== block && (
				<CombatInfo label="Shield block value">
					{block}
				</CombatInfo>
			)}

			{null !== shield && (
				<CombatInfo label="Energy shield value">
					{shield}
				</CombatInfo>
			)}

			{(1 !== statusModifier) && (
				<CombatInfo label="Status modifier">
					x{statusModifier}
				</CombatInfo>
			)}
		</React.Fragment>
	);
};

export default TargetInfo;
