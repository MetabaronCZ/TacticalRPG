import React from 'react';
import { Switch, MemoryRouter, Route } from 'react-router';

import routes from 'ui/common/Router/routes';

const Router: React.SFC<{}> = () => (
	<MemoryRouter>
		<Switch>
			{routes.map((route, key) => (
				<Route exact={true} path={route.path} component={route.component} key={key} />
			))}
		</Switch>
	</MemoryRouter>
);

export default Router;
