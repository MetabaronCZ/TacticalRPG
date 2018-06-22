import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import Button, { ButtonSize } from 'components/Button';
import { gotoFn } from 'utils/nav';

interface IMenuItem {
	readonly title: string;
	readonly ico?: string;
	readonly size?: string;
	readonly url: string;
}

const menuItems: IMenuItem[] = [
	{ title: 'Start Battle', ico: 'fight', size: ButtonSize.LARGE, url: '/battle-setup' },
	{ title: 'Edit Party', url: '/party-list' },
	{ title: 'Edit Characters', url: '/character-list' }
];

const ViewMainMenuContainer: React.SFC<RouteComponentProps<any>> = ({ history }) => (
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
