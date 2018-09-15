import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import initStore from 'store';
import Router from 'ui/common/Router';
import PageWrapper from 'ui/common/PageWrapper';

export const store = initStore();

ReactDOM.render(
	<PageWrapper>
		<Provider store={store}>
			<Router />
		</Provider>
	</PageWrapper>,
	document.querySelector('.PageContainer')
);
