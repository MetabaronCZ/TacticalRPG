import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import ViewPartyList from 'pages/ViewPartyList/template';

import { IStore } from 'store';
import { gotoFn } from 'utils/nav';
import { IParty } from 'models/party';
import * as Selector from 'selectors';
import Actions from 'actions/parties';

export type IOnMoveDown = (party: IParty) => () => void;
export type IOnMoveUp = (party: IParty) => () => void;
export type IOnDelete = (party: IParty, name: string) => () => void;

interface IStateToProps {
	parties: IParty[];
}

interface IViewPartyListContainerProps extends RouteComponentProps<any> {
	onMoveDown: IOnMoveDown;
	onMoveUp: IOnMoveUp;
	onDelete: IOnDelete;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	parties: Selector.getParties(state)
});

const mapDispatchToProps = (dispatch: Dispatch<IParty>) => ({
	onMoveDown: (party: IParty) => () => {
		dispatch(Actions.moveDownList(party));
	},
	onMoveUp: (party: IParty) => () => {
		dispatch(Actions.moveUpList(party));
	},
	onDelete: (party: IParty, name: string) => () => {
		if (confirm(`Do you realy want to delete "${name}"?`)) {
			dispatch(Actions.removeParty(party));
		}
	}
});

const ViewPartyListContainer: React.SFC<IViewPartyListContainerProps & IStateToProps> = props => {
	const { parties, history, onMoveDown, onMoveUp, onDelete } = props;
	const fnCreate = gotoFn(history, '/party-create');
	const fnGoBack = gotoFn(history, '/');

	return (
		<ViewPartyList
			parties={parties}
			onBack={fnGoBack}
			onCreate={fnCreate}
			onMoveDown={onMoveDown}
			onMoveUp={onMoveUp}
			onDelete={onDelete}
		/>
	);
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ViewPartyListContainer)
);
