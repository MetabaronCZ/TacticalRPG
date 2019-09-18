import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoFn } from 'core/navigation';
import { RouteID, IRouteParams } from 'modules/route';

import PageWrapper from 'ui/common/PageWrapper';
import Button, { ButtonSize, ButtonIco } from 'ui/common/Button';

interface IMenuItem {
	readonly title: string;
	readonly ico?: ButtonIco;
	readonly size?: ButtonSize;
	readonly route: RouteID;
}

const menuItems: IMenuItem[] = [
	{ title: 'Start Battle', ico: 'fight', size: 'large', route: 'BATTLE_CONFIG' },
	{ title: 'Party Creation', route: 'PARTY_LIST' },
	{ title: 'Character Creation', route: 'CHARACTER_LIST' }
];

const MainMenuPage: React.SFC<RouteComponentProps<IRouteParams>> = ({ history }) => (
	<PageWrapper>
		<div className="MainMenu">
			<ul className="MainMenu-butttons">
				{menuItems.map(item => (
					<li className="MainMenu-buttons-item" key={item.title}>
						<Button
							ico={item.ico}
							size={item.size}
							text={item.title}
							onClick={gotoFn(history, item.route)}
						/>
					</li>
				))}
			</ul>
		</div>
	</PageWrapper>
);

export default withRouter(MainMenuPage);
