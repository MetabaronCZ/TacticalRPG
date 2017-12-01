import React from 'react';
import FormRadio from 'ui/components/FormRadio';
import ArchetypeIco from 'ui/components/ArchetypeIco';
import Archetypes from 'data/archetypes';
import { SizeID } from 'ui/components/ArchetypeIco/sizes';
import { ArchetypeCharacteristicID as ArchCharID } from 'models/archetype';

interface IArchetypeSelectionProps {
	primary?: ArchCharID;
	secondary?: ArchCharID;
	onChange?: () => void;
}

interface IArchCharData {
	[key: string]: ArchCharID;
}

const ArchetypeSelection = ({
	primary = ArchCharID.P,
	secondary = ArchCharID.P,
	onChange
}: IArchetypeSelectionProps): JSX.Element => {
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
				{Object.keys(data).map((attr: string, i: number) => (
					<div className="ArchetypeSelection-body-row" key={i}>
						<div className="ArchetypeSelection-body-inputWrapper">
							{Object.keys(Archetypes).map((arch: string, j: number) => (
								<FormRadio
									id={`f-archetype-${attr}-${arch}`}
									label={Archetypes[arch].title}
									name={attr}
									value={arch}
									isChecked={arch === data[attr]}
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
