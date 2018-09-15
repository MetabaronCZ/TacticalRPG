import React from 'react';
import { Dispatch } from 'redux';
import { History } from 'history';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Page from 'ui/common/Page';
import PartyCreation from 'ui/party-creation/PartyCreation';

import { IStore } from 'store';
import Actions from 'actions/parties';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';

import { IParty } from 'modules/party/types';
import { ICharacterData } from 'modules/character-data/types';

interface IStateToProps {
	readonly parties?: IParty[];
	readonly characters?: ICharacterData[];
}

interface IPartyEditPageContainerProps extends RouteComponentProps<any> {
	readonly onSubmit: (history: History) => (party: IParty) => void;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state),
	parties: Selector.getParties(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<IParty>>) => ({
	onSubmit: (history: History) => (party: IParty) => {
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
