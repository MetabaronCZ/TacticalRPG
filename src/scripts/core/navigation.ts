import { History } from 'history';
import { RouteID, getPath } from 'modules/route';

// navigate to given path
export const goto = (history: History, url: string): void => history.push(url);

// navigate to given RouteID
export const gotoRoute = (history: History, route: RouteID): void => goto(history, getPath(route));

// returns function of "goto"
export const gotoFn = (history: History, route: RouteID) => () => gotoRoute(history, route);
