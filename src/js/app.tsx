import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Router from 'ui/components/Router';
import PageWrapper from 'ui/components/PageWrapper';

import store from 'store';

ReactDOM.render(
	<PageWrapper>
		<Provider store={store()}>
			<Router />
		</Provider>
	</PageWrapper>,
	document.querySelector('.PageContainer')
);
