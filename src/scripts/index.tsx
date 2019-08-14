import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, context } from 'context';
import Router from 'ui/common/Router';

const App: React.SFC = () => (
	<Provider value={context}>
		<Router />
	</Provider>
);

ReactDOM.render(
	<App />,
	document.querySelector('.PageContainer')
);
