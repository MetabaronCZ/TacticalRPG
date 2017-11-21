import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { goto, gotoFn } from 'utils/nav';
import Page from 'ui/components/Page';
import BattleSetup from 'ui/components/BattleSetup';

const mapStateToProps = state => ({
	parties: state.parties,
	characters: state.characters
});

const onStart = history => (params = {}) => {
	goto(history, `/battle/${params.party}`);
};

const ViewBattleSetupContainer = ({ characters, parties, history }) => (
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
	connect(
		mapStateToProps,
		null
	)(ViewBattleSetupContainer)
);
