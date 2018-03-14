import React from 'react';
import { History } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Page from 'components/Page';
import PartyCreation from 'components/PartyCreation';

import { IState, IAction } from 'store';
import actions from 'actions/app/parties';
import { goto, gotoFn } from 'utils/nav';

import { IParty } from 'models/party';
import { ICharacterData } from 'models/character-data';

interface IStateToProps {
	parties?: IParty[];
	characters?: ICharacterData[];
}

interface IViewPartyEditContainerProps extends RouteComponentProps<any> {
	onSubmit: (history: History) => any;
}

const mapStateToProps = (state: IState): IStateToProps => ({
	parties: state.app.parties,
	characters: state.app.characters
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	onSubmit: (history: History) => (party: IParty) => {
		dispatch(actions.editParty(party));
		goto(history, '/party-list');
	}
});

const ViewPartyEditContainer: React.SFC<IViewPartyEditContainerProps & IStateToProps> = props => {
	const { parties, characters, onSubmit, history, match } = props;
	const party = (parties ? parties.find(c => c.id === match.params.id) : undefined);

	return (
		<Page heading="Edit party">
			<PartyCreation
				party={party}
				characters={characters}
				onBack={gotoFn(history, '/party-list')}
				onSubmit={onSubmit(history)}
			/>
		</Page>
	);
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ViewPartyEditContainer)
);
