import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';

import Page from 'components/Page';
import BattleSetup from 'components/BattleSetup';

import { IParty } from 'modules/party/types';
import { ICharacterData } from 'modules/character-data/types';

interface IStateToProps {
	readonly characters: ICharacterData[];
	readonly parties: IParty[];
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state),
	parties: Selector.getParties(state)
});

const onStart = (history: History) => (partyId: string|null) => {
	goto(history, `/battle/${partyId}`);
};

const ViewBattleSetupContainer: React.SFC<IStateToProps & RouteComponentProps<any>> = ({ characters, parties, history }) => (
	<Page heading="Battle setup">
		<BattleSetup
			characters={characters}
			parties={parties}
			onBack={gotoFn(history, '/')}
			onStart={onStart(history)}
		/>
	</Page>
);

export default withRouter(
	connect(mapStateToProps)(ViewBattleSetupContainer)
);
