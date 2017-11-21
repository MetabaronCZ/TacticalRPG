import React from 'react';
import FormRadio from 'ui/components/FormRadio';
import ArchetypeIco from 'ui/components/ArchetypeIco';
import archetypes from 'data/archetype';

const ArchetypeSelection = ({ primary, secondary, onChange }) => {
	let data = { primary, secondary	};

	return (
		<div className="ArchetypeSelection">
			<div className="ArchetypeSelection-header">
				<div className="ArchetypeSelection-header-primary">
					Primary<br />characteristic
				</div>

				<div className="ArchetypeSelection-header-ico">
					<ArchetypeIco size="large" primary={primary} secondary={secondary} />
				</div>

				<div className="ArchetypeSelection-header-secondary">
					Secondarary<br />characteristic
				</div>
			</div>

			<div className="ArchetypeSelection-body">
				{Object.keys(data).map((attr, i) => (
					<div className="ArchetypeSelection-body-row" key={i}>
						<div className="ArchetypeSelection-body-inputWrapper">	
							{Object.keys(archetypes).map((arch, j) => (
								<FormRadio
									id={`f-archetype-${attr}-${arch}`}
									label={archetypes[arch].title}
									name={attr}
									value={arch}
									isChecked={arch === data[attr]}
									onChange={onChange} key={j}
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
