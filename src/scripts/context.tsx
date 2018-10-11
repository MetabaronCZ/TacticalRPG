import React from 'react';
import { observer } from 'mobx-react';

import { Store } from 'engine/store';

export interface IContext {
	store: Store;
}

export const context: IContext = {
	store: new Store()
};

export const { Provider, Consumer } = React.createContext<IContext>(context);

export const withContext = <T extends IContext>(Component: React.ComponentType<T>): React.SFC<T> => {
	return observer((props: T) => (
		<Consumer>
			{ctx => <Component {...props} store={ctx.store} />}
		</Consumer>
	));
};
