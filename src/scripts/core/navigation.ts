import { History } from 'history';
import { RouteID } from 'modules/route';
import paths from 'data/routes';

// navigate to given path
export const goto = (history: History, route: RouteID): void => history.push(paths[route]);

// returns function of "goto"
export const gotoFn = (history: History, route: RouteID) => () => goto(history, route);
