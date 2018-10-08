import React from 'react';
import ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';

import { Provider, context } from 'context';

import Router from 'ui/common/Router';
import PageWrapper from 'ui/common/PageWrapper';

ReactDOM.render(
	<PageWrapper>
		<Provider value={context}>
			<Router />
		</Provider>

		<DevTools />
	</PageWrapper>,
	document.querySelector('.PageContainer')
);
