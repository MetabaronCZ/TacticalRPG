import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Store from 'store';
import Router from 'ui/components/Router';
import PageWrapper from 'ui/components/PageWrapper';

export const store = (new Store()).get();

ReactDOM.render(
	<PageWrapper>
		<Provider store={store}>
			<Router />
		</Provider>
	</PageWrapper>,
	document.querySelector('.PageContainer')
);
