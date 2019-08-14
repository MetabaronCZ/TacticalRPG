import paths from 'data/routes';
import { getPath, RouteID } from 'modules/route';

describe('modules.route', () => {
	describe('#getPath', () => {
		test('it returns right URL path to given route', () => {
			const route: RouteID = 'CHARACTER_CREATE';
			const path = paths[route];
			const result = getPath(route);
			expect(result).toEqual(path);
		});

		test('it applies given parameters correctly', () => {
			const route: RouteID = 'PARTY_EDIT';
			const path = paths[route];
			expect(path).toMatch(/:id/);

			const res1 = getPath(route);
			expect(res1).toEqual(path);

			const res2 = getPath(route, '');
			expect(res2).toEqual(path);

			const param = 'x=10';
			const res3 = getPath(route, param);
			expect(res3).toEqual(res1.replace(':id', param));
		});
	});
});
