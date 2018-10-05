import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import initStore from 'store';
import Router from 'ui/common/Router';
import PageWrapper from 'ui/common/PageWrapper';

import { Provider as P2, context } from 'context';

export const store = initStore();

ReactDOM.render(
	<PageWrapper>
		<Provider store={store}>
			<P2 value={context}>
				<Router />
			</P2>
		</Provider>
	</PageWrapper>,
	document.querySelector('.PageContainer')
);
