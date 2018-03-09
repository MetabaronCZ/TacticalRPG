import React from 'react';
import { History } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Page from 'ui/components/Page';
import PartyCreation from 'ui/components/PartyCreation';

import { goto, gotoFn } from 'utils/nav';
import actions from 'actions/app/parties';
import { IState, IAction } from 'store';

import { IParty } from 'models/party';
import { ICharacterData } from 'models/character-data';

interface IStateToProps {
	characters?: ICharacterData[];
}

interface IViewPartyCreateContainerProps extends RouteComponentProps<any> {
	onSubmit: (history: History) => any;
}

const mapStateToProps = (state: IState): IStateToProps => ({
	characters: state.app.characters
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	onSubmit: (history: History) => (value: IParty): void => {
		dispatch(actions.addParty(value));
		goto(history, '/party-list');
	}
});

const ViewPartyCreateContainer: React.SFC<IViewPartyCreateContainerProps & IStateToProps> = (props) => {
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
