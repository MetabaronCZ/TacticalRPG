import React from 'react';
import { History } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Page from 'components/Page';
import PartyCreation from 'components/PartyCreation';

import * as Selector from 'selectors';
import actions from 'actions/parties';
import { goto, gotoFn } from 'utils/nav';
import { IStore, IAction } from 'store';

import { IParty } from 'models/party';
import { ICharacterData } from 'models/character-data';

interface IStateToProps {
	characters?: ICharacterData[];
}

interface IViewPartyCreateContainerProps extends RouteComponentProps<any> {
	onSubmit: (history: History) => any;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state)
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	onSubmit: (history: History) => (value: IParty): void => {
		dispatch(actions.addParty(value));
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
