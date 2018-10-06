import Battle from 'ui/battle/BattlePage';
import MainMenu from 'ui/menu/MainMenuPage';
import BattleConfig from 'ui/battle/BattleConfigPage';
import BattleSummary from 'ui/battle/BattleSummaryPage';
import PartyList from 'ui/party-creation/PartyListPage';
import PartyEdit from 'ui/party-creation/PartyEditPage';
import PartyCreate from 'ui/party-creation/PartyCreationPage';
import CharacterList from 'ui/character-creation/CharacterListPage';
import CharacterEdit from 'ui/character-creation/CharacterEditPage';
import CharacterCreate from 'ui/character-creation/CharacterCreationPage';

interface IRoute {
	readonly path: string;
	readonly component: React.ComponentType<any>;
}

const routes: IRoute[] = [
	{ path: '/', component: MainMenu },
	{ path: '/battle-config', component: BattleConfig },
	{ path: '/battle', component: Battle },
	{ path: '/battle-summary', component: BattleSummary },
	{ path: '/party-list', component: PartyList },
	{ path: '/party-edit/:id', component: PartyEdit },
	{ path: '/party-create', component: PartyCreate },
	{ path: '/character-list', component: CharacterList },
	{ path: '/character-edit/:id', component: CharacterEdit },
	{ path: '/character-create', component: CharacterCreate }
];

export default routes;
