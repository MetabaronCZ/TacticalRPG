import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { gotoFn } from 'utils/nav';
import ViewCharacterList from 'ui/views/ViewCharacterList/template';

import actions from 'ui/actions/characters';

const mapStateToProps = state => ({
	characters: state.characters
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
			dispatch(actions.removeCharacter(id));
		}
	}
});

const ViewCharacterListContainer = ({ characters, history, onMoveDown, onMoveUp, onDelete }) => (
	<ViewCharacterList
		characters={characters}
		onBack={gotoFn(history, '/')}
		onCreate={gotoFn(history, '/character-create')}
		onMoveDown={onMoveDown}
		onMoveUp={onMoveUp}
		onDelete={onDelete}
	/>
);

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ViewCharacterListContainer)
);
