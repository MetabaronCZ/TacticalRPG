import { createMemoryHistory, MemoryHistory } from 'history';

import paths from 'data/routes';
import { RouteID } from 'modules/route';
import { goto, gotoRoute, gotoFn } from 'core/navigation';

const createHistory = (): MemoryHistory => createMemoryHistory({
	initialEntries: [],
	initialIndex: 0
});

const hasNavigated = (history: MemoryHistory, path: string): boolean => {
	if (1 !== history.entries.length) {
		return false;
	}
	return path === history.entries[0].pathname;
};

describe('core.navigation', () => {
	describe('#goto()', () => {
		test('it navigates to given URL', () => {
			const history = createHistory();
			expect(history.entries.length).toEqual(0);

			const path = '/myPage';
			goto(history, path);

			expect(hasNavigated(history, path)).toBeTruthy();
		});
	});

	describe('#gotoRoute()', () => {
		test('it navigates to given route', () => {
			const history = createHistory();
			expect(history.entries.length).toEqual(0);

			const route: RouteID = 'CHARACTER_LIST';
			gotoRoute(history, route);

			const path = paths[route];
			expect(hasNavigated(history, path)).toBeTruthy();
		});
	});

	describe('#gotoFn()', () => {
		test('it returns function which navigates to given route', () => {
			const history = createHistory();
			expect(history.entries.length).toEqual(0);

			const route: RouteID = 'CHARACTER_LIST';
			const fn = gotoFn(history, route);
			expect(history.entries.length).toEqual(0);

			fn();

			const path = paths[route];
			expect(hasNavigated(history, path)).toBeTruthy();
		});
	});
});
