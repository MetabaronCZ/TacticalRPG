import React from 'react';
import { Switch, MemoryRouter, Route } from 'react-router';
import routes, { IRoute } from 'ui/components/Router/routes';

const Router = (): JSX.Element => (
	<MemoryRouter>
		<Switch>
			{routes.map((route, key) => (
				<Route exact={true} path={route.path} component={route.component} key={key} />
			))}
		</Switch>
	</MemoryRouter>
);

export default Router;
