// navigate to given path
export const goto = (history, path) => history.push(path);

// returns function of "goto"
export const gotoFn = (history, path) => () => goto(history, path);
