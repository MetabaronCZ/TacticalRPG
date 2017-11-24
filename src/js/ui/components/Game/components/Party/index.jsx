import React from 'react';
import ArchetypeIco from 'ui/components/ArchetypeIco';
import Bar from 'ui/components/Game/components/Bar';

import icos from 'utils/icos';
import Jobs from 'data/jobs';

const Party = ({ characters }) => (
	<div className="Party">
		<h2 className="Heading">
			Party
		</h2>

		{characters.map((char, i) => {
			let attrs = char.getAttributes();

			return (
				<div className="Party-item" key={i}>
					{char.name} <ArchetypeIco primary={char.primary} secondary={char.secondary} /> {icos[char.sex]} {Jobs[char.job].title}

					<Bar
						hp={attrs.current.HP}
						hpMax={attrs.base.HP}
						ap={attrs.current.AP}
						apMax={attrs.base.AP}
					/>
				</div>
			);
		})}
	</div>
);

export default Party;
