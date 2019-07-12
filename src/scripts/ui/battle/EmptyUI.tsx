import React from 'react';
import PlayerIco from 'ui/battle/PlayerIco';

const EmptyUI: React.SFC = () => {
	return (
		<div className="CharacterBox">
			<PlayerIco />
		</div>
	);
};

export default EmptyUI;
