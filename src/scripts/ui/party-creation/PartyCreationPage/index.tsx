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
	readonly characters?: ICharacterData[];
}

interface IPartyCreationPageContainerProps extends RouteComponentProps<any> {
	readonly onSubmit: (history: History) => (party: IParty) => void;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<IParty>>) => ({
	onSubmit: (history: History) => (value: IParty): void => {
		dispatch(Actions.addParty(value));
		goto(history, '/party-list');
	}
});

const PartyCreationPageContainer: React.SFC<IPartyCreationPageContainerProps & IStateToProps> = props => {
	const { characters, onSubmit, history } = props;

	return (
		<Page heading="Party creation">
			<PartyCreation
				characters={characters}
				onBack={gotoFn(history, '/party-list')}
				onSubmit={onSubmit(history)}
			/>
		</Page>
	);
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(PartyCreationPageContainer)
);
