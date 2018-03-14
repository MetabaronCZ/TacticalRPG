import MainMenu from 'views/ViewMainMenu';
import BattleSetup from 'views/ViewBattleSetup';
import Battle from 'views/ViewBattle';
import BattleSummary from 'views/ViewBattleSummary';
import PartyList from 'views/ViewPartyList';
import PartyEdit from 'views/ViewPartyEdit';
import PartyCreate from 'views/ViewPartyCreate';
import CharacterList from 'views/ViewCharacterList';
import CharacterEdit from 'views/ViewCharacterEdit';
import CharacterCreate from 'views/ViewCharacterCreate';

interface IRoute {
	readonly path: string;
	readonly component: React.ComponentType<any>;
}

const routes: IRoute[] = [
	{ path: '/', component: MainMenu },
	{ path: '/battle-setup', component: BattleSetup },
	{ path: '/battle/:party', component: Battle },
	{ path: '/battle-summary', component: BattleSummary },
	{ path: '/party-list', component: PartyList },
	{ path: '/party-edit/:id', component: PartyEdit },
	{ path: '/party-create', component: PartyCreate },
	{ path: '/character-list', component: CharacterList },
	{ path: '/character-edit/:id', component: CharacterEdit },
	{ path: '/character-create', component: CharacterCreate },
];

export default routes;
