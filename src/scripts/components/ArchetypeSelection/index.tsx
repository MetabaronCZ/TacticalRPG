import React from 'react';

import { ArchCharID, Archetypes } from 'models/archetype';

import FormRadio from 'components/FormRadio';
import ArchetypeIco from 'components/ArchetypeIco';
import { SizeID } from 'components/ArchetypeIco/sizes';

interface IArchetypeSelectionProps {
	primary?: ArchCharID;
	secondary?: ArchCharID;
	onChange?: () => void;
}

interface IArchCharData {
	[key: string]: ArchCharID;
}

const ArchetypeSelection: React.SFC<IArchetypeSelectionProps> = props => {
	const { primary = ArchCharID.P, secondary = ArchCharID.P, onChange } = props;
	const data: IArchCharData = { primary, secondary };

	return (
		<div className="ArchetypeSelection">
			<div className="ArchetypeSelection-header">
				<div className="ArchetypeSelection-header-primary">
					Primary<br />characteristic
				</div>

				<div className="ArchetypeSelection-header-ico">
					<ArchetypeIco size={SizeID.large} primary={primary} secondary={secondary} />
				</div>

				<div className="ArchetypeSelection-header-secondary">
					Secondarary<br />characteristic
				</div>
			</div>

			<div className="ArchetypeSelection-body">
				{Object.keys(data).map((attr, i) => (
					<div className="ArchetypeSelection-body-row" key={i}>
						<div className="ArchetypeSelection-body-inputWrapper">
							{Archetypes.map((id, arch, j) => (
								<FormRadio
									id={`f-archetype-${attr}-${id}`}
									label={arch.title}
									name={attr}
									value={id}
									isChecked={id === data[attr]}
									onChange={onChange}
									key={j}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ArchetypeSelection;
