import MainMenu from 'ui/views/ViewMainMenu';
import BattleSetup from 'ui/views/ViewBattleSetup';
import Battle from 'ui/views/ViewBattle';
import BattleSummary from 'ui/views/ViewBattleSummary';
import PartyList from 'ui/views/ViewPartyList';
import PartyEdit from 'ui/views/ViewPartyEdit';
import PartyCreate from 'ui/views/ViewPartyCreate';
import CharacterList from 'ui/views/ViewCharacterList';
import CharacterEdit from 'ui/views/ViewCharacterEdit';
import CharacterCreate from 'ui/views/ViewCharacterCreate';

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
