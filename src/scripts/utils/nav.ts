import { History } from 'history';

// navigate to given path
export const goto = (history: History, path: string): void => history.push(path);

// returns function of "goto"
export const gotoFn = (history: History, path: string) => () => goto(history, path);
