import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { goto, gotoFn } from 'utils/nav';

import Page from 'ui/components/Page';
import BattleSetup from 'ui/components/BattleSetup';

import { IState } from 'store';
import { IPartyData } from 'models/party';
import { ICharacterData } from 'models/character';

interface IOnStartParams {
	party?: string;
}

interface IStateToProps {
	characters?: ICharacterData[];
	parties?: IPartyData[];
}

const mapStateToProps = (state: IState): IStateToProps => ({
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
	connect<IStateToProps>(mapStateToProps)(ViewBattleSetupContainer)
);
