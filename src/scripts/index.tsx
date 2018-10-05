import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, context } from 'context';

import Router from 'ui/common/Router';
import PageWrapper from 'ui/common/PageWrapper';

ReactDOM.render(
	<PageWrapper>
		<Provider value={context}>
			<Router />
		</Provider>
	</PageWrapper>,
	document.querySelector('.PageContainer')
);
