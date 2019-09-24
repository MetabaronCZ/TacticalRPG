import React from 'react';
import { Switch, MemoryRouter, Route } from 'react-router';

import { RouteID, getPath } from 'modules/route';

import MainMenu from 'ui/menu/MainMenuPage';

import Battle from 'ui/battle/BattlePage';
import BattleConfig from 'ui/battle-config/BattleConfigPage';
import BattleSummary from 'ui/battle-summary/BattleSummaryPage';

import PartyList from 'ui/party-creation/PartyListPage';
import PartyEdit from 'ui/party-creation/PartyEditPage';
import PartyCreate from 'ui/party-creation/PartyCreationPage';

import CharacterList from 'ui/character-creation/CharacterListPage';
import CharacterEdit from 'ui/character-creation/CharacterEditPage';
import CharacterCreate from 'ui/character-creation/CharacterCreationPage';

interface IRoute {
	readonly id: RouteID;
	readonly component: React.ComponentType<any>;
}

const routes: IRoute[] = [
	{ id: 'ROOT', component: MainMenu },
	{ id: 'BATTLE_CONFIG', component: BattleConfig },
	{ id: 'BATTLE', component: Battle },
	{ id: 'BATTLE_SUMMARY', component: BattleSummary },
	{ id: 'PARTY_LIST', component: PartyList },
	{ id: 'PARTY_EDIT', component: PartyEdit },
	{ id: 'PARTY_CREATE', component: PartyCreate },
	{ id: 'CHARACTER_LIST', component: CharacterList },
	{ id: 'CHARACTER_EDIT', component: CharacterEdit },
	{ id: 'CHARACTER_CREATE', component: CharacterCreate }
];

const Router: React.SFC<{}> = () => (
	<MemoryRouter>
		<Switch>
			{routes.map(route => (
				<Route
					exact={true}
					path={getPath(route.id)}
					component={route.component}
					key={route.id}
				/>
			))}
		</Switch>
	</MemoryRouter>
);

export default Router;
