import React from 'react';
import { History } from 'history';
import { Action } from 'redux-actions';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Page from 'components/Page';
import PartyCreation from 'components/PartyCreation';

import { IStore } from 'store';
import Actions from 'actions/parties';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';

import { IParty } from 'modules/party/types';
import { ICharacterData } from 'modules/character-data/types';

interface IStateToProps {
	readonly characters?: ICharacterData[];
}

interface IViewPartyCreateContainerProps extends RouteComponentProps<any> {
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

const ViewPartyCreateContainer: React.SFC<IViewPartyCreateContainerProps & IStateToProps> = props => {
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
	connect(mapStateToProps, mapDispatchToProps)(ViewPartyCreateContainer)
);
