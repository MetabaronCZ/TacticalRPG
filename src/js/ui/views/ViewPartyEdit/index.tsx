import React from 'react';
import { History } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';

import { goto, gotoFn } from 'utils/nav';
import actions from 'actions/parties';
import Page from 'ui/components/Page';
import PartyCreation from 'ui/components/PartyCreation';
import { IState, IAction } from 'store';
import { IParty } from 'models/party';
import { ICharacter } from 'models/character';

const mapStateToProps = (state: IState) => ({
	parties: state.parties,
	characters: state.characters
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	onSubmit: (history: History) => (party: IParty) => {
		dispatch(actions.editParty(party));
		goto(history, '/party-list');
	}
});

interface IViewPartyEditContainerProps {
	parties: IParty[];
	characters: ICharacter[];
	onSubmit: (history: History) => any;
	history: History;
	match: any;
}

const ViewPartyEditContainer = ({ parties, characters, onSubmit, history, match }: IViewPartyEditContainerProps): JSX.Element => {
	const party = parties.find((c) => c.id === match.params.id);

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
	connect(mapStateToProps, mapDispatchToProps)(ViewPartyEditContainer as any)
);
