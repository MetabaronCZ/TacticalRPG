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
	characters: state.characters
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	onSubmit: (history: History) => (value: IParty): void => {
		dispatch(actions.addParty(value));
		goto(history, '/party-list');
	}
});

interface IViewPartyCreateContainerProps {
	characters: ICharacter[];
	onSubmit: (history: History) => any;
	history: History;
}

const ViewPartyCreateContainer = ({ characters, onSubmit, history }: IViewPartyCreateContainerProps): JSX.Element => (
	<Page heading="Party creation">
		<PartyCreation
			characters={characters}
			onBack={gotoFn(history, '/party-list')}
			onSubmit={onSubmit(history)}
		/>
	</Page>
);

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ViewPartyCreateContainer as any)
);
