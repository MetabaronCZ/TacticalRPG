import React from 'react';
import { Dispatch } from 'redux';
import { History } from 'history';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import Actions from 'actions/parties';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';

import { IPartyData } from 'engine/party-data';
import { ICharacterData } from 'engine/character-data';

import Page from 'ui/common/Page';
import PartyCreation from 'ui/party-creation/PartyCreation';

interface IStateToProps {
	readonly parties?: IPartyData[];
	readonly characters?: ICharacterData[];
}

interface IPartyEditPageContainerProps extends RouteComponentProps<any> {
	readonly onSubmit: (history: History) => (party: IPartyData) => void;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state),
	parties: Selector.getParties(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<IPartyData>>) => ({
	onSubmit: (history: History) => (party: IPartyData) => {
		dispatch(Actions.editParty(party));
		goto(history, '/party-list');
	}
});

const PartyEditPageContainer: React.SFC<IPartyEditPageContainerProps & IStateToProps> = props => {
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
	connect(mapStateToProps, mapDispatchToProps)(PartyEditPageContainer)
);
