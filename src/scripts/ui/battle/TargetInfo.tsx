import React from 'react';

import { ITargetCombatPreview } from 'modules/battle/combat';

import ElementIco from 'ui/common/ElementIco';
import CombatInfo from 'ui/battle/CombatInfo';

interface IProps {
	preview: ITargetCombatPreview;
}

const TargetInfo: React.SFC<IProps> = ({ preview }) => {
	const {
		statusModifier, block, shield,
		elementalStrength, elementalWeakness
	} = preview;

	return (
		<React.Fragment>
			{!!elementalStrength && (
				<CombatInfo label="Elemental strength">
					<ElementIco element={elementalStrength} />
				</CombatInfo>
			)}

			{!!elementalWeakness && (
				<CombatInfo label="Elemental weakness">
					<ElementIco element={elementalWeakness} />
				</CombatInfo>
			)}

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
