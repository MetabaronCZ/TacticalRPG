import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { goto, gotoFn } from 'utils/nav';

import Page from 'ui/components/Page';
import BattleSetup from 'ui/components/BattleSetup';

import { IState } from 'store';
import { IPartyData } from 'models/party';
import { ICharacterData } from 'models/character';

const mapStateToProps = (state: IState) => ({
	parties: state.parties,
	characters: state.characters
});

interface IOnStartParams {
	party?: string;
}

const onStart = (history: History) => (params: IOnStartParams = {}) => {
	goto(history, `/battle/${params.party}`);
};

interface IViewBattleSetupContainerProps {
	characters: ICharacterData[];
	parties: IPartyData[];
	history: History;
}

const ViewBattleSetupContainer = ({ characters, parties, history }: IViewBattleSetupContainerProps): JSX.Element => (
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
	connect(mapStateToProps, null)(ViewBattleSetupContainer as any)
);
