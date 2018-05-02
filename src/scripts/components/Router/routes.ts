import MainMenu from 'pages/ViewMainMenu';
import BattleSetup from 'pages/ViewBattleSetup';
import Battle from 'pages/ViewBattle';
import BattleSummary from 'pages/ViewBattleSummary';
import PartyList from 'pages/ViewPartyList';
import PartyEdit from 'pages/ViewPartyEdit';
import PartyCreate from 'pages/ViewPartyCreate';
import CharacterList from 'pages/ViewCharacterList';
import CharacterEdit from 'pages/ViewCharacterEdit';
import CharacterCreate from 'pages/ViewCharacterCreate';

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
	{ path: '/character-create', component: CharacterCreate }
];

export default routes;
