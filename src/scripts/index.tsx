import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, context } from 'context';
import Router from 'ui/common/Router';

ReactDOM.render(
	<React.Fragment>
		<Provider value={context}>
			<Router />
		</Provider>
	</React.Fragment>,
	document.querySelector('.PageContainer')
);
