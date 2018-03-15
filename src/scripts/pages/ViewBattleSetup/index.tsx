import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import { goto, gotoFn } from 'utils/nav';

import Page from 'components/Page';
import BattleSetup from 'components/BattleSetup';

import { IParty } from 'models/party';
import { ICharacterData } from 'models/character-data';

interface IOnStartParams {
	party?: string;
}

interface IStateToProps {
	characters: ICharacterData[];
	parties: IParty[];
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	parties: state.parties,
	characters: state.characters
});

const onStart = (history: History) => (params: IOnStartParams = {}) => {
	goto(history, `/battle/${params.party}`);
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
