import React from 'react';
import { withRouter } from 'react-router';

import Button from 'ui/components/Button';
import { gotoFn } from 'utils/nav';

const menuItems = [
	{ title: 'Start Battle', ico: 'fight', size: 'large', url: '/battle-setup' },
	{ title: 'Edit Party', url: '/party-list' },
	{ title: 'Edit Characters', url: '/character-list' }
];

const ViewMainMenuContainer = ({ history }) => (
	<div className="MainMenu">
		<ul className="MainMenu-butttons">
			{menuItems.map((item, i) => (
				<li className="MainMenu-buttons-item" key={i}>
					<Button ico={item.ico} size={item.size} text={item.title} onClick={gotoFn(history, item.url)} />
				</li>
			))}
		</ul>
	</div>
);

export default withRouter(ViewMainMenuContainer);
