import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, context } from 'context';

import Debug from 'ui/Debug';
import Router from 'ui/common/Router';
import PageWrapper from 'ui/common/PageWrapper';

ReactDOM.render(
	<PageWrapper>
		<Provider value={context}>
			<Router />
		</Provider>

		<Debug />
	</PageWrapper>,
	document.querySelector('.PageContainer')
);
