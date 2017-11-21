import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { gotoFn } from 'utils/nav';
import ViewPartyList from 'ui/views/ViewPartyList/template';

import actions from 'ui/actions/parties';

const mapStateToProps = state => ({
	parties: state.parties
});

const mapDispatchToProps = dispatch => ({
	onMoveDown: id => () => {
		dispatch(actions.moveDownList(id));
	},
	onMoveUp: id => () => {
		dispatch(actions.moveUpList(id));
	},
	onDelete: (id, name) => () => {
		if ( confirm(`Do you realy want to delete "${name}"?`) ){
			dispatch(actions.removeParty(id));
		}
	}
});

const ViewPartyListContainer = ({ parties, history, onMoveDown, onMoveUp, onDelete }) => (
	<ViewPartyList
		parties={parties}
		onBack={gotoFn(history, '/')}
		onCreate={gotoFn(history, '/party-create')}
		onMoveDown={onMoveDown}
		onMoveUp={onMoveUp}
		onDelete={onDelete}
	/>
);

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ViewPartyListContainer)
);
